let moment = require('moment')
let math = require('mathjs')
let Calc = require('./calculator')
let CashFlow = require('./cashFlow')
let Periods = require('./periods')

math.config({
  number: 'BigNumber',
  precision: 64
})

function bondYld({ rate, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, dayCount = 365 }) {
  // continuous compounding
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

  return x1
}

function ytm({ ...args }) {
  // mirrors underlying pmt structure
  let bondYield = bondYld({ ...args })
  return toYtm(bondYield)
}

function toYtm({ m = 2, rc }) {
  return Calc.compoundM({ m, rc })
}

function toBondYld({ m = 2, rm }) {
  return Calc.continuousM({ m, rm })
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

  // let bondYield = Yielder({ rate, cleanPx, exit })
  // console.log('bond yield:', bondYield.toString())
  let ytom = ytm({ rate, cleanPx, exit })
  // let ytm = Calc.equivM({ m: 2, rc: bondYield })
  console.log('ytm:', ytom.toString())

  // let periods = Periods({ exit })
  // let pmtDates = periods.dates.slice(1)
  //
  // let entry = periods.dates[0]
  // let m1 = (12 + entry.month() - 6) % 12
  // let y1 = m1 < entry.month() ? entry.year() : entry.year() - 1
  // let daysInMonth = moment({ year: y1, month:m1 }).daysInMonth()
  //
  // let last = moment({
  //   year: y1,
  //   month: m1,
  //   date: Math.min(exit.date(), daysInMonth)
  // })
  //
  // let accruedPct = entry.diff(last, 'days') / pmtDates[0].diff(last, 'days')
  //
  // let annuity = pmtDates.reduce((acc, date, i) => {
  //   let t = date.diff(moment(), 'days') / 365
  //   let inc = Math.exp(-bondYield * t)
  //   if (i === 0) {
  //     inc *= (1 - accruedPct)
  //   }
  //   return acc + inc
  // }, 0)

  // let t = exit.diff(moment(), 'days') / 365
  // let terminal = 100 * Math.exp(-bondYield * t)
  // let parYield = (100 - terminal) * 2 / annuity

} else {
  module.exports = {
    bondYld,
    ytm,
    toYtm,
    toBondYld
  }
}
