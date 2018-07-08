let Calendar = require('./calendar')
let Calculator = require('./calculator')
let { getPv, getPvs } = require('./pver')

function weightPmts(pvs) {
  return pvs.reduce((acc, pv) => {
    let tc = Calculator.multiply(pv.amount, pv.timeFromNow())
    return Calculator.add(acc, tc)
  }, 0)
}

function mDuration({ ... args }) {
  let { px, rm, m, fvs } = args
  let pvs = getPvs({ fvs, rm, m })
  return Calculator.mDuration({ waPvs: weightPmts(pvs), px, y: rm, m })
}

// macD
// modD

module.exports = {
  mDuration
}
