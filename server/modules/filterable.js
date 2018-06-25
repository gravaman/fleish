let MetricHandler = require('./metricHandler')

let Filterable = {
  investables: [],
  metric: null,
  [Symbol.iterator]: function() {
    let investables = this.investables.slice()

    return {
      next: function() {
        if (investables.length > 0) {
          let investable = investables.shift()
          return {
            value: MetricHandler[metric](investable),
            done: false
          }
        }
        return { done: true }
      }
    }
  }
}

module.exports = Filterable
