
function Range(start = 0, length = 10, step = 1) {
  return Array.from(Array(length).keys())
    .map((val, i) => i * step + start)
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
function selectRandom(args) {
  return args[randomInt(args.length)]
}

function randomInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  Range,
  selectRandom,
  randomInt,
  randomInclusive
}
