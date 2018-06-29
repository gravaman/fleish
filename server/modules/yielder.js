let moment = require('moment')
let Calc = require('./calculator')
let CashFlow = require('./cashFlow')
let Periods = require('./periods')
let DayCounter = require('./dayCounter')

function yld({ r, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, convention = DayCounter.Conventions.US_30_360 }) {
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, r, cleanPx, redemptionPx, notional, convention })

  let stable = false
  let k = 0
  let x0 = r
  let x1 = x0
  while (!stable && k < 1000) {
    x1 = Calc.newtRoot({ x0, y: npv(cf, x0), dy: npvdx(cf, x0) })
    stable = Calc.stable({ x1, x0, theta: 0.00001 })
    k++
    x0 = x1
  }

  // match compounding rate with frequency
  return Calc.compoundM({ m: frequency, rc: x1 })
}

function npv(cf, r) {
  function pv(pmt, r) {
    let { fv, t } = pvPrep(pmt)
    return Calc.pv({ fv, t, r })
  }

  let pmts = cf.pmts.slice(1)
  return  pmts.reduce((acc, pmt) => Calc.add(acc, pv(pmt, r)), cf.first.principal)
}

function npvdx(cf, r) {
  function pvdx(pmt, r) {
    let { fv, t } = pvPrep(pmt)
    return Calc.pvdx({ fv, t, r })
  }

  let pmts = cf.pmts.slice(1)
  return pmts.reduce((acc, pmt) => Calc.add(acc, pvdx(pmt, r)), 0)
}

function pvPrep(pmt, convention = DayCounter.Conventions.US_30_360) {
  let accrued = pmt.date.diff(moment(), 'days')
  let t = Calc.divide(accrued, convention.daysInYear)
  let fv = Calc.add(pmt.coupon, pmt.principal)
  return { fv, t }
}

if (require.main === module) {
  let exit = moment({ year: 2023, month: 11, date: 28 })
  let r = 0.055
  let cleanPx = 100

  let y1 = yld({ r, cleanPx, exit })
  console.log('yield:', y1.toString())
} else {
  module.exports = { yld }
}
