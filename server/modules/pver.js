let moment = require('moment')
let Calc = require('./calculator')
let Payment = require('./payment')

let Pver = {
  npv: function(pmts, r, entry) {
    return pmts.reduce((acc, pmt) => Calc.add(acc, Calc.pv({ fv: pmt.amount, r, t: pmt.timeFromDate(entry.date) })), entry.amount)
  },
  npvm: function(pmts, r, m, entry) {
    return pmts.reduce((acc, pmt) => Calc.add(acc, Calc.pvm({ c: pmt.amount, y: r, k: m, t: pmt.timeFromDate(entry.date) })), entry.amount)
  },
  npvdx: function(pmts, r, entry) {
    return pmts.reduce((acc, pmt) => Calc.add(acc, Calc.pvdx({ fv: pmt.amount, r, t: pmt.timeFromDate(entry.date) })), entry.amount)
  },
  getPvs: function({ ...args }) {
    let { fvs, rm, m, entry } = args
    let rc = Calc.continuousM({ m, rm })
    return fvs.map(fv => Payment({
        date: fv.date,
        coupon: Calc.pv({ fv: fv.coupon, r: rc, t: fv.timeFromDate(entry.date) }),
        principal: Calc.pv({ fv: fv.principal, r: rc, t: fv.timeFromDate(entry.date) })
      })
    )
  }
}

module.exports = Pver
