let Filtration = function(name) {
  return {
    gt(value) {
      return (target) => target[name] > value
    },
    gte(value) {
      return (target) => target[name] >= value
    },
    lt(value) {
      return (target) => target[name] < value
    },
    lte(value) {
      return (target) => target[name] <= value
    },
    eq(value) {
      return (target) => target[name] === value
    }
  }
}

module.exports = Filtration
