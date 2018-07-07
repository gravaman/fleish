let Calc = require('./calculator')

let Pver = {
  npv: function(pmts, r) {
    return pmts.reduce((acc, pmt) => {
      let pv = Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromNow() })
      return Calc.add(acc, pv)
    }, 0)
  }
}

module.exports = Pver
