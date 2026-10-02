export function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 24) || 'task'
  )
}

// `extra` supplies additional named placeholders beyond {task}/{task_slug} -
// currently {expression}/{answer} for math-category content (see
// engine/parseArithmetic.js). Callers only pass values for placeholders
// they've already confirmed are safe to use (see needsArithmetic).
export function fillTemplate(text, task, extra = {}) {
  let result = text.replace(/\{task\}/g, task).replace(/\{task_slug\}/g, slugify(task))
  for (const [key, value] of Object.entries(extra)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}

export function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Shuffles a pool (which may contain intentional duplicates for weighting)
// and returns up to `count` *distinct* values - so weighting a pool by
// repeating entries can't accidentally pick the same line twice.
export function pickUnique(pool, count) {
  const seen = new Set()
  const result = []
  for (const item of shuffle(pool)) {
    if (seen.has(item)) continue
    seen.add(item)
    result.push(item)
    if (result.length >= count) break
  }
  return result
}
