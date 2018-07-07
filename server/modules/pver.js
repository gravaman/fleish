let Calc = require('./calculator')
let Payment = require('./payment')

let Pver = {
  npv: function(pmts, r) {
    return pmts.reduce((acc, pmt) => {
      let pv = Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromNow() })
      return Calc.add(acc, pv)
    }, 0)
  },
  getPvs: function({ ...args }) {
    let { fvs, rm, m } = args
    let rc = Calc.continuousM({ m, rm })
    return fvs.map(fv => {
      return Payment({
        date: fv.date,
        coupon: Calc.pv({ fv: fv.coupon, r: rc, t: fv.timeFromNow() }),
        principal: Calc.pv({ fv: fv.principal, r: rc, t: fv.timeFromNow() })
      })
    })
  }
}

module.exports = Pver
