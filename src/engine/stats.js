export const INITIAL_STATS = { chaos: 0, files: 0, tests: 0, branches: 0, tokens: 0, sanity: 100 }

export function clampStats(stats) {
  return {
    chaos: Math.max(0, Math.min(100, stats.chaos)),
    files: Math.max(0, stats.files),
    tests: Math.max(0, stats.tests),
    branches: Math.max(0, stats.branches),
    tokens: Math.max(0, stats.tokens),
    sanity: Math.max(0, Math.min(100, stats.sanity)),
  }
}

export function mergeDeltas(stats, deltas = {}) {
  return clampStats({
    chaos: stats.chaos + (deltas.chaos || 0),
    files: stats.files + (deltas.files || 0),
    tests: stats.tests + (deltas.tests || 0),
    branches: stats.branches + (deltas.branches || 0),
    tokens: stats.tokens + (deltas.tokens || 0),
    sanity: stats.sanity + (deltas.sanity || 0),
  })
}
