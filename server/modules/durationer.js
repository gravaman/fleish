let Calendar = require('./calendar')
let Calculator = require('./calculator')

function weightPmts(pmts) {
  return pmts.reduce((acc, pmt) => {
    let tc = Calculator.multiply(pmt.amount, pmt.timeFromNow())
    return Calculator.add(acc, tc)
  }, 0)
}

let Durationer = {
  getDuration: (px, pmts) => {
    return weightPmts(pmts) / px
  }
}

module.exports = Durationer
