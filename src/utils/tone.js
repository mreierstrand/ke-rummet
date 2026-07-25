// Deterministic warm tone per name, so each placeholder frame is stable
// across renders without needing any external image or stored photo.
const TONES = [
  ['#e8a33d', '#a97426'],
  ['#c1443b', '#7c2c26'],
  ['#caa06a', '#8a6a3d'],
  ['#b96b8f', '#7a3f57'],
  ['#7fa8a0', '#4d6b65'],
  ['#d9c27e', '#93793f'],
]

export function toneFor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return TONES[hash % TONES.length]
}

export function initialsFor(name) {
  return name.slice(0, 1).toUpperCase()
}
