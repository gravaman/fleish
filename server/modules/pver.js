let moment = require('moment')
let Calc = require('./calculator')
let Payment = require('./payment')

let Pver = {
  npv: function(pmts, r, entry = Payment({ date: moment() })) {
    return pmts.reduce((acc, pmt) => Calc.add(acc, Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromNow() })), entry.amount)
  },
  npvdx: function(pmts, r, entry = Payment({ date: moment() })) {
    return pmts.reduce((acc, pmt) => Calc.add(acc, Calc.pvdx({ fv: pmt.amount, r, t: pmt.timeFromNow() })), entry.amount)
  },
  getPv: function(fv, r) {
    return Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromNow() })
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
