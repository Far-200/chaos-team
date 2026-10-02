export function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 24) || 'task'
  )
}

export function fillTemplate(text, task) {
  return text.replace(/\{task\}/g, task).replace(/\{task_slug\}/g, slugify(task))
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
