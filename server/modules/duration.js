let Calendar = require('./calendar')
let Calculator = require('./calculator')

function weightPmts(pvs) {
  return pvs.reduce((acc, pv) => {
    let tc = Calculator.multiply(pv.amount, pv.timeFromNow())
    return Calculator.add(acc, tc)
  }, 0)
}

function mDuration({ ... args }) {
  let { px, y, m, pvs } = args
  return Calculator.mDuration({ waPvs: weightPmts(pvs), px, y, m })
}

module.exports = {
  mDuration
}

// let Durationer = {
//   duration: (px, y, m, pvs) => {
//     return Calculator.mDuration({ waPvs: weightPmts(pvs), px, y, m })
//   }
// }
//
// module.exports = Durationer
