let Calc = require('./calculator')

let Pver = {
  npv: function(pmts, r) {
    return pmts.reduce((acc, pmt) => {
      let pv = Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromNow() })
      console.log('the pv:', pv.toString(), 'the t:', pmt.timeFromNow().toString())
      return Calc.add(acc, pv)
    }, 0)
  }
}

module.exports = Pver
