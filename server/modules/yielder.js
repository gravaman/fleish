let moment = require('moment')
let math = require('mathjs')
let Calc = require('./calculator')
let CashFlow = require('./cashFlow')
let Periods = require('./periods')

math.config({
  number: 'BigNumber',
  precision: 64
})

function yld({ rate, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, dayCount = 365 }) {
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, rate, cleanPx, redemptionPx, notional, dayCount })

  let stable = false
  let k = 0
  let x0 = math.bignumber(rate)
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
  return  pmts.reduce((acc, pmt) => math.add(acc, pv(pmt, r)), math.bignumber(cf.first.principal))
}

function npvdx(cf, r) {
  function pvdx(pmt, r) {
    let { fv, t } = pvPrep(pmt)
    return Calc.pvdx({ fv, t, r })
  }

  let pmts = cf.pmts.slice(1)
  return pmts.reduce((acc, pmt) => math.add(acc, pvdx(pmt, r)), 0)
}

function pvPrep(pmt, dayCount = 365) {
  let accrued = pmt.date.diff(moment(), 'days')
  let t = math.bignumber(accrued / dayCount)
  let fv = math.add(pmt.coupon, pmt.principal)
  return { fv, t }
}

if (require.main === module) {
  let exit = moment({ year: 2023, month: 11, date: 28 })
  let rate = math.bignumber(0.055)
  let cleanPx = math.bignumber(100)

  let y1 = yld({ rate, cleanPx, exit })
  console.log('yield:', y1.toString())
} else {
  module.exports = { yld }
}
