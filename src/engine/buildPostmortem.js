import { createRandom, createSeed } from './seededRandom.js'
import { taskIdentity } from './taskIdentity.js'
import { fillTemplate } from './utils.js'
import { needsArithmetic, formatAnswer } from './parseArithmetic.js'
import { ROOT_CAUSES_BY_CATEGORY, UNIVERSAL_ROOT_CAUSES, CLOSINGS_BY_CATEGORY, UNIVERSAL_CLOSINGS } from '../data/postmortemContent.js'

export function buildPostmortem({ task, finalStats, participating, category, arithmetic }) {
  const { pickRandom, pickUnique } = createRandom(createSeed(`${taskIdentity(category, arithmetic)}:postmortem`))
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
  const agentName = pickRandom(participating).name
  const templateExtra = arithmetic ? { expression: arithmetic.expression, answer: formatAnswer(arithmetic.answer) } : {}
  const fill = (text) => fillTemplate(text, task, templateExtra).replace(/\{agentName\}/g, agentName)

  const categoryCauses = ROOT_CAUSES_BY_CATEGORY[category] || ROOT_CAUSES_BY_CATEGORY.generic
  let causePool = [...categoryCauses, ...categoryCauses, ...UNIVERSAL_ROOT_CAUSES]
  if (!arithmetic) causePool = causePool.filter((c) => !needsArithmetic(c))
  const rootCauses = pickUnique(causePool, 3).map(fill)

  const categoryClosings = CLOSINGS_BY_CATEGORY[category] || CLOSINGS_BY_CATEGORY.generic
  let closingPool = [...categoryClosings, ...categoryClosings, ...UNIVERSAL_CLOSINGS]
  if (!arithmetic) closingPool = closingPool.filter((c) => !needsArithmetic(c))
  const closing = fill(pickRandom(closingPool))

  return { status, statusLabel, completed, rootCauses, closing }
}
