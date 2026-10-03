import { AGENTS } from '../data/agents.js'
import { CLIMAX_BY_CATEGORY } from '../data/climax.js'
import { SYSTEM_BEATS, AMBIENT_SYSTEM_BY_CATEGORY } from '../data/systemEvents.js'
import { BANTER_EXCHANGES } from '../data/banter.js'
import { RARE_EVENTS } from '../data/rareEvents.js'
import { classifyTask } from './classifyTask.js'
import { parseSimpleArithmetic, formatAnswer, needsArithmetic } from './parseArithmetic.js'
import { fillTemplate } from './utils.js'
import { createRandom, createSeed } from './seededRandom.js'
import { taskIdentity } from './taskIdentity.js'

// Pacing bounds (ms). Typing and reading are deliberately separate so a
// message's arrival and the pause to actually read it don't blur together.
const TYPING_MS = [500, 1200]
const READ_MS = [700, 1400]
const SYSTEM_READ_MS = [1000, 1600]
const CLIMAX_READ_MS = [1600, 2400]

// Banter lines are quick back-and-forth, not full "beats" - snappier pacing.
const BANTER_TYPING_MS = [300, 700]
const BANTER_READ_MS = [400, 900]
const AMBIENT_READ_MS = [800, 1300]

// Builds the full, pre-scripted sequence of feed events for a task.
// Everything is selected deterministically up front - playback just reveals events
// one by one and folds each event's `deltas` onto a running stats total.
export function buildIncident(task) {
  const category = classifyTask(task)

  // For math tasks, try to deterministically solve the expression so
  // content can reference the *actual* answer instead of assuming one.
  // null means "couldn't parse it" or "division/modulo by zero" - either
  // way, content needing {expression}/{answer} is filtered out below.
  const arithmetic = category === 'math' ? parseSimpleArithmetic(task) : null
  const canonicalTaskKey = taskIdentity(category, arithmetic)
  const seed = createSeed(canonicalTaskKey)
  const random = createRandom(seed)
  const { rng, shuffle, randInt, pickRandom } = random
  const templateExtra = arithmetic ? { expression: arithmetic.expression, answer: formatAnswer(arithmetic.answer) } : {}
  const fill = (text) => fillTemplate(text, task, templateExtra)

  // Gemini is the "optional" fifth teammate - shows up most of the time, not always.
  const participating = AGENTS.filter((a) => a.id !== 'gemini' || rng() < 0.7)

  const stepCount = 14 + Math.floor(rng() * 7) // 14-20 beats
  const climaxIndex = Math.floor(stepCount * 0.75)
  const extrasSchedule = pickExtrasSchedule(stepCount, climaxIndex, random)

  const events = []
  let idCounter = 0

  function pushEvent(kind, agentId, text, deltas, timing) {
    events.push({ id: idCounter++, kind, agentId, text, deltas, ...timing })
  }

  pushEvent('system', null, SYSTEM_BEATS.kickoff(task), {}, { typingMs: 0, postMs: randInt(...SYSTEM_READ_MS) })

  const queues = {}
  participating.forEach((a) => {
    queues[a.id] = shuffle(buildAgentPool(a, category, Boolean(arithmetic), random))
  })

  for (let i = 0; i < stepCount; i++) {
    if (i === climaxIndex) {
      let climaxPool = CLIMAX_BY_CATEGORY[category] || CLIMAX_BY_CATEGORY.generic
      if (!arithmetic) climaxPool = climaxPool.filter((c) => !needsArithmetic(c.text))
      const climax = pickRandom(climaxPool)
      pushEvent('climax', null, fill(climax.text), climax.deltas, {
        typingMs: 0,
        postMs: randInt(...CLIMAX_READ_MS),
      })
      continue
    }

    const agent = pickRandom(participating)
    let queue = queues[agent.id]
    if (queue.length === 0) {
      queue = shuffle(buildAgentPool(agent, category, Boolean(arithmetic), random))
    }
    let beat = queue.pop()
    let filledText = fill(beat.text)

    // Guard against an exact immediate repeat (same agent, same resulting
    // text) - can happen right after a banter block that ended on this
    // agent, or across a queue reshuffle boundary.
    const lastEvent = events[events.length - 1]
    if (lastEvent && lastEvent.kind === 'agent' && lastEvent.agentId === agent.id && lastEvent.text === filledText && queue.length > 0) {
      const alt = queue.pop()
      queue.unshift(beat)
      beat = alt
      filledText = fill(beat.text)
    }

    queues[agent.id] = queue
    pushEvent('agent', agent.id, filledText, beat.deltas, {
      typingMs: randInt(...TYPING_MS),
      postMs: randInt(...READ_MS),
    })

    const extra = extrasSchedule[i]
    if (extra === 'banter') {
      const eligible = BANTER_EXCHANGES.filter((ex) => {
        if (ex.excludeCategories && ex.excludeCategories.includes(category)) return false
        if (ex.requiresArithmetic && !arithmetic) return false
        return true
      })

      // Avoid picking an exchange whose opening line would exactly repeat
      // the beat that was just pushed (same agent, same resulting text).
      const lastPushed = events[events.length - 1]
      let exchange = pickRandom(eligible)
      for (let attempt = 0; attempt < 3; attempt++) {
        const opener = exchange.lines[0]
        const openerMatches = opener.agentId === lastPushed.agentId && fill(opener.text) === lastPushed.text
        if (!openerMatches) break
        exchange = pickRandom(eligible)
      }
      exchange.lines.forEach((line) => {
        pushEvent('agent', line.agentId, fill(line.text), {}, {
          typingMs: randInt(...BANTER_TYPING_MS),
          postMs: randInt(...BANTER_READ_MS),
        })
      })
    } else if (extra === 'rare') {
      const rare = pickRandom(RARE_EVENTS)
      const typingRange = rare.typingOverrideMs || TYPING_MS
      pushEvent(
        rare.kind,
        rare.agentId || null,
        fill(rare.text),
        rare.deltas || {},
        rare.kind === 'agent'
          ? { typingMs: randInt(...typingRange), postMs: randInt(...READ_MS) }
          : { typingMs: 0, postMs: randInt(...AMBIENT_READ_MS) }
      )
    } else if (extra === 'ambient') {
      const pool = AMBIENT_SYSTEM_BY_CATEGORY[category] || AMBIENT_SYSTEM_BY_CATEGORY.generic
      pushEvent('system', null, fill(pickRandom(pool)), {}, { typingMs: 0, postMs: randInt(...AMBIENT_READ_MS) })
    }
  }

  pushEvent('system', null, SYSTEM_BEATS.wrapup, {}, { typingMs: 0, postMs: randInt(...SYSTEM_READ_MS) })

  return {
    task,
    canonicalTaskKey,
    seed,
    category,
    arithmetic,
    participating,
    events,
    interventionPoints: pickInterventionPoints(events, random),
  }
}

// Builds this agent's draw queue for the incident: every beat appears
// exactly once (no literal duplicates, so the same line can't land twice
// in a row), but category beats are front-loaded ~70% of the time so the
// conversation stays mostly on-topic while still mixing in some
// persona-flavored universal variety. Beats needing {expression}/{answer}
// are dropped when no arithmetic result is available.
function buildAgentPool(agent, category, arithmeticAvailable, { rng, shuffle }) {
  let categoryBeats = agent.categoryBeats[category] || agent.categoryBeats.generic || []
  if (!arithmeticAvailable) categoryBeats = categoryBeats.filter((b) => !needsArithmetic(b.text))
  categoryBeats = shuffle(categoryBeats)

  const universalBeats = shuffle(agent.universalBeats)

  const merged = []
  let ci = 0
  let ui = 0
  while (ci < categoryBeats.length || ui < universalBeats.length) {
    const drawCategory = ci < categoryBeats.length && (ui >= universalBeats.length || rng() < 0.7)
    merged.push(drawCategory ? categoryBeats[ci++] : universalBeats[ui++])
  }
  return merged
}

// Decides which (non-climax) iterations get an extra flavor insertion -
// banter, a rare event, or an ambient system line - and how many. Most
// incidents get 0-2; it's deliberately uncommon to feel organic.
function pickExtrasSchedule(stepCount, climaxIndex, { rng, shuffle }) {
  const eligible = []
  for (let i = 0; i < stepCount; i++) {
    if (i !== climaxIndex) eligible.push(i)
  }

  const roll = rng()
  const count = roll < 0.3 ? 0 : roll < 0.75 ? 1 : roll < 0.95 ? 2 : 3

  const chosen = shuffle(eligible).slice(0, Math.min(count, eligible.length))
  const schedule = {}
  chosen.forEach((i) => {
    const r = rng()
    schedule[i] = r < 0.45 ? 'banter' : r < 0.75 ? 'rare' : 'ambient'
  })
  return schedule
}

// Picks 2-3 points (always on an agent beat) spread across the timeline -
// roughly one from the early third, one from the middle, one from the late
// third - so the user gets pulled into the chat at sensible moments.
function pickInterventionPoints(events, { rng, shuffle }) {
  const agentIndices = events.reduce((acc, ev, i) => {
    if (ev.kind === 'agent') acc.push(i)
    return acc
  }, [])

  if (agentIndices.length < 6) return []

  const third = Math.floor(agentIndices.length / 3)
  const buckets = [
    agentIndices.slice(0, third),
    agentIndices.slice(third, third * 2),
    agentIndices.slice(third * 2),
  ].filter((b) => b.length > 0)

  const count = Math.min(buckets.length, 2 + Math.floor(rng() * 2)) // 2-3
  return shuffle(buckets)
    .slice(0, count)
    .map((bucket) => bucket[Math.floor(rng() * bucket.length)])
    .sort((a, b) => a - b)
}
