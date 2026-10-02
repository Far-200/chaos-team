// Tiny, explicit single-expression arithmetic parser - no eval()/Function().
// Finds the first "left OP right" pattern anywhere in the task text (so it
// still works inside a sentence like "What is 2+2?") and computes it with
// plain JS operators. Supports + - * / %, optional whitespace, and a
// leading "-" on either operand.
const EXPRESSION_RE = /(-?\d+(?:\.\d+)?)\s*([+\-*/%])\s*(-?\d+(?:\.\d+)?)/

export function parseSimpleArithmetic(task) {
  if (typeof task !== 'string') return null

  const match = EXPRESSION_RE.exec(task)
  if (!match) return null

  const [expression, leftStr, operator, rightStr] = match
  const left = Number(leftStr)
  const right = Number(rightStr)

  let answer
  switch (operator) {
    case '+':
      answer = left + right
      break
    case '-':
      answer = left - right
      break
    case '*':
      answer = left * right
      break
    case '/':
      if (right === 0) return null
      answer = left / right
      break
    case '%':
      if (right === 0) return null
      answer = left % right
      break
    default:
      return null
  }

  // Guards against anything that slipped through as Infinity/NaN.
  if (!Number.isFinite(answer)) return null

  return { expression: expression.trim(), left, operator, right, answer }
}

// Rounds a computed answer to something short and screenshot-friendly
// (no 0.3333333333333333) without pretending the math is more precise.
export function formatAnswer(answer) {
  if (Number.isInteger(answer)) return String(answer)
  return String(Math.round(answer * 1000) / 1000)
}

// Whether a content template depends on the computed arithmetic result -
// used to filter such lines out of the draw pool when no expression could
// be parsed (or it was a division/modulo by zero).
export function needsArithmetic(text) {
  return /\{expression\}|\{answer\}/.test(text)
}
