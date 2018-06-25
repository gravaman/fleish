let Filterable = {
  investables: [],
  [Symbol.iterator]: function() {
    let investables = this.investables.slice()

    return {
      next: function() {
        if (investables.length > 0) {
          let investable = investables.shift()
          return {
            value: investable,
            done: false
          }
        }
        return { done: true }
      }
    }
  }
}

module.exports = Filterable
