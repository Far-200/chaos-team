import { shuffle, randInt, pickRandom, pickUnique } from './utils.js'

// FNV-1a over JavaScript UTF-16 code units; unsigned 32-bit seed.
export function createSeed(key) {
  let hash = 2166136261
  for (let i = 0; i < key.length; i++) {
    hash = Math.imul(hash ^ key.charCodeAt(i), 16777619)
  }
  return hash >>> 0
}

// Mulberry32. State belongs to this instance, never to a render or module.
export function createPRNG(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), state | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function createRandom(seed) {
  const rng = createPRNG(seed)
  return {
    rng,
    shuffle: (items) => shuffle(items, rng),
    randInt: (min, max) => randInt(min, max, rng),
    pickRandom: (items) => pickRandom(items, rng),
    pickUnique: (items, count) => pickUnique(items, count, rng),
  }
}
