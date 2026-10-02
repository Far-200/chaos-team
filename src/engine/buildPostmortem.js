import { shuffle } from './utils'

const ROOT_CAUSE_POOL = (task, agentName) => [
  `${agentName} interpreted "${task}" as an invitation to redesign the architecture.`,
  'Nobody asked whether the change actually needed five reviewers.',
  'A one-line fix was blocked behind a multi-step migration plan.',
  'Three branches attempted to solve the exact same problem at once.',
  'The postmortem took longer to write than the original task.',
  'A feature flag was added to toggle a feature nobody requested.',
]

const CLOSING_POOL = [
  'The original task remains, historically, a point of contention.',
  'A calendar invite has been sent for the retro about this retro.',
  'No agents were harmed. Several were humbled.',
  'This has been filed as a "learning" rather than a "failure".',
  'Leadership has been briefed. Leadership has questions.',
]

export function buildPostmortem({ task, finalStats, participating }) {
  const { chaos, tests } = finalStats

  let status = 'unresolved'
  let statusLabel = 'Unresolved - rolled back'
  if (chaos < 35 && tests <= 2) {
    status = 'resolved'
    statusLabel = 'Resolved'
  } else if (chaos < 70) {
    status = 'resolved-ish'
    statusLabel = 'Resolved (technically)'
  }

  const completed = status !== 'unresolved'
  const agentName = participating[Math.floor(Math.random() * participating.length)].name

  const rootCauses = shuffle(ROOT_CAUSE_POOL(task, agentName)).slice(0, 3)
  const closing = CLOSING_POOL[Math.floor(Math.random() * CLOSING_POOL.length)]

  return { status, statusLabel, completed, rootCauses, closing }
}
