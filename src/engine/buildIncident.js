import { AGENTS, CLIMAX_BEATS, SYSTEM_BEATS } from '../data/agents'
import { fillTemplate, shuffle, randInt } from './utils'

// Pacing bounds (ms). Typing and reading are deliberately separate so a
// message's arrival and the pause to actually read it don't blur together.
const TYPING_MS = [500, 1200]
const READ_MS = [700, 1400]
const SYSTEM_READ_MS = [1000, 1600]
const CLIMAX_READ_MS = [1600, 2400]

// Builds the full, pre-scripted sequence of feed events for a task.
// Everything is randomized locally up front - playback just reveals events
// one by one and folds each event's `deltas` onto a running stats total.
export function buildIncident(task) {
  // Gemini is the "optional" fifth teammate - shows up most of the time, not always.
  const participating = AGENTS.filter((a) => a.id !== 'gemini' || Math.random() < 0.7)

  const stepCount = 14 + Math.floor(Math.random() * 7) // 14-20 beats
  const climaxIndex = Math.floor(stepCount * 0.75)

  const events = []
  let idCounter = 0

  function pushEvent(kind, agentId, text, deltas, timing) {
    events.push({ id: idCounter++, kind, agentId, text, deltas, ...timing })
  }

  pushEvent('system', null, SYSTEM_BEATS.kickoff(task), {}, { typingMs: 0, postMs: randInt(...SYSTEM_READ_MS) })

  const queues = {}
  participating.forEach((a) => {
    queues[a.id] = shuffle(a.beats)
  })

  for (let i = 0; i < stepCount; i++) {
    if (i === climaxIndex) {
      const climax = CLIMAX_BEATS[Math.floor(Math.random() * CLIMAX_BEATS.length)]
      pushEvent('climax', null, climax.text, climax.deltas, { typingMs: 0, postMs: randInt(...CLIMAX_READ_MS) })
      continue
    }

    const agent = participating[Math.floor(Math.random() * participating.length)]
    let queue = queues[agent.id]
    if (queue.length === 0) {
      queue = shuffle(agent.beats)
    }
    const beat = queue.pop()
    queues[agent.id] = queue
    pushEvent('agent', agent.id, fillTemplate(beat.text, task), beat.deltas, {
      typingMs: randInt(...TYPING_MS),
      postMs: randInt(...READ_MS),
    })
  }

  pushEvent('system', null, SYSTEM_BEATS.wrapup, {}, { typingMs: 0, postMs: randInt(...SYSTEM_READ_MS) })

  return { task, participating, events, interventionPoints: pickInterventionPoints(events) }
}

// Picks 2-3 points (always on an agent beat) spread across the timeline -
// roughly one from the early third, one from the middle, one from the late
// third - so the user gets pulled into the chat at sensible moments.
function pickInterventionPoints(events) {
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

  const count = Math.min(buckets.length, 2 + Math.floor(Math.random() * 2)) // 2-3
  return shuffle(buckets)
    .slice(0, count)
    .map((bucket) => bucket[Math.floor(Math.random() * bucket.length)])
    .sort((a, b) => a - b)
}
