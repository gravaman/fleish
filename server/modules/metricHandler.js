let Price = require('../models/price')

let MetricHandler = {
  current(investable) {
    let price = Price.findOne({ ticker: investable.ticker })
    return investable.rate / price.value
  }
}

module.exports = MetricHandler
