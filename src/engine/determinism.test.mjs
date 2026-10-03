import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { buildIncident } from './buildIncident.js'
import { buildPostmortem } from './buildPostmortem.js'
import { buildCustomReactionSteps } from './buildReactions.js'
import { classifyTask } from './classifyTask.js'
import { createSeed, createPRNG } from './seededRandom.js'
import { INITIAL_STATS, mergeDeltas } from './stats.js'
import { slugify } from './utils.js'
import { USER_REPLY_PRESETS } from '../data/userReplies.js'

const tasks = ['Center the login button', 'Fix a typo in the footer', 'What is 2+2?',
  'Calculate 9 / 3', 'calculate 1/0', 'calculate fibonacci', 'Update React', 'git rebase', 'sort an array', 'zzzz']

function simulate(task, preset = null) {
  const incident = buildIncident(task)
  let finalStats = INITIAL_STATS
  const reactions = []
  incident.events.forEach((event, index) => {
    if (incident.interventionPoints.includes(index)) {
      finalStats = mergeDeltas(finalStats, preset ? preset.deltas : { chaos: 2 })
      reactions.push(preset ? preset.steps : buildCustomReactionSteps(incident.seed, index))
    }
    finalStats = mergeDeltas(finalStats, event.deltas)
  })
  return { incident, reactions, finalStats, postmortem: buildPostmortem({ ...incident, finalStats }) }
}

test('same task reproduces entire structured incident, reactions, stats and postmortem', () => {
  for (const task of tasks) {
    for (const preset of [null, ...USER_REPLY_PRESETS]) {
      assert.deepEqual(simulate(task, preset), simulate(task, preset))
    }
  }
})

test('fresh runs do not inherit state from other incidents or repeated postmortems', () => {
  const first = simulate(tasks[0])
  for (const task of tasks.slice(1)) simulate(task)
  for (let i = 0; i < 10; i++) buildPostmortem({ ...first.incident, finalStats: first.finalStats })
  assert.deepEqual(simulate(tasks[0]), first)
})

test('different supported categories and arithmetic expressions select different sequences', () => {
  const sequence = (task) => buildIncident(task).events.map(({ kind, agentId, deltas }) => ({ kind, agentId, deltas }))
  assert.notDeepEqual(sequence(tasks[0]), sequence(tasks[1]))
  assert.notDeepEqual(sequence('calculate 2+2'), sequence('calculate 9/3'))
})

// Original task/expression text is intentionally echoed by existing templates.
function withoutEchoes(output) {
  const { task, arithmetic } = output.incident
  let serialized = JSON.stringify({ ...output, incident: { ...output.incident, task: null, arithmetic: null, canonicalTaskKey: null } })
  for (const echo of [task, slugify(task), arithmetic?.expression].filter(Boolean)) {
    serialized = serialized.split(echo).join('<input>')
  }
  return JSON.parse(serialized)
}

test('accepted phrasings use the same canonical selection, preserving input echoes', () => {
  for (const phrasings of [
    ['reverse a string', 'reverse this string', 'string reverse'],
    ['Center the login button', 'center a button'],
    ['What is 2+2?', 'Calculate 2 + 2'],
  ]) {
    const first = simulate(phrasings[0])
    for (const phrase of phrasings.slice(1)) {
      const next = simulate(phrase)
      assert.equal(next.incident.canonicalTaskKey, first.incident.canonicalTaskKey)
      assert.equal(next.incident.seed, first.incident.seed)
      assert.deepEqual(withoutEchoes(next), withoutEchoes(first))
    }
  }
})

test('unmatched input retains generic fallback and arithmetic guards remain intact', () => {
  for (const task of ['zzzz', 'tell me a bedtime story', '']) {
    assert.equal(classifyTask(task), 'generic')
    assert.equal(buildIncident(task).category, 'generic')
    assert.deepEqual(simulate(task), simulate(task))
  }
  for (const task of tasks) {
    const result = simulate(task)
    assert.doesNotMatch(JSON.stringify([result.incident.events, result.postmortem]), /\{(?:expression|answer|task|task_slug|agentName)\}/)
  }
})

test('outcome builders never consult ambient randomness or wall time', () => {
  const random = Math.random
  const now = Date.now
  const forbidden = () => { throw new Error('ambient nondeterminism') }
  try {
    Math.random = forbidden
    Date.now = forbidden
    for (const task of tasks) simulate(task)
  } finally {
    Math.random = random
    Date.now = now
  }
  for (const name of readdirSync(new URL('.', import.meta.url)).filter((name) => name.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(new URL(name, import.meta.url), 'utf8'), /Math\.random|Date\.now|performance\.now|randomUUID|getRandomValues/)
  }
  assert.doesNotMatch(readFileSync(new URL('../App.jsx', import.meta.url), 'utf8'), /Math\.random|randomUUID|getRandomValues/)
})

test('PRNG has stable known values and independent state, including zero seed', () => {
  assert.equal(createSeed('hello'), 1335831723)
  const rng = createPRNG(1)
  assert.deepEqual(Array.from({ length: 3 }, rng), [0.6270739405881613, 0.002735721180215478, 0.5274470399599522])
  const a = createPRNG(0)
  const b = createPRNG(0)
  for (let i = 0; i < 100; i++) {
    const value = a()
    assert.equal(value, b())
    assert.ok(value >= 0 && value < 1)
  }
})
