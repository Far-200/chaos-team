import { AGENTS } from '../data/agents.js'
import { AGENT_REACTIONS } from '../data/userReplies.js'
import { createRandom, createSeed } from './seededRandom.js'

// A separate stream per intervention makes reactions independent of timer
// scheduling, earlier replies, and whether playback was fast-forwarded.
export function buildCustomReactionSteps(seed, eventIndex) {
  const { rng, pickRandom } = createRandom(createSeed(`${seed}:reaction:${eventIndex}`))
  const first = pickRandom(AGENTS)
  const steps = [{ agentId: first.id, text: pickRandom(AGENT_REACTIONS[first.id]) }]
  if (rng() < 0.3) {
    const second = pickRandom(AGENTS.filter((agent) => agent.id !== first.id))
    steps.push({ agentId: second.id, text: pickRandom(AGENT_REACTIONS[second.id]) })
  }
  return steps
}
