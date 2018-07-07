let Calendar = require('./calendar')
let Calculator = require('./calculator')

function weightPmts(pvs) {
  return pvs.reduce((acc, pv) => {
    let tc = Calculator.multiply(pv.amount, pv.timeFromNow())
    return Calculator.add(acc, tc)
  }, 0)
}

let Durationer = {
  duration: (px, y, m, pvs) => {
    return weightPmts(pvs) / px / (1 + y / m)
  }
}

module.exports = Durationer
