let moment = require('moment')
let math = require('mathjs')

math.config({
  number: 'BigNumber',
  precision: 64
})

let Yielder = function({ rate, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, dayCount = 365 }) {
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, rate, cleanPx, redemptionPx, notional, dayCount })

  let stable = false
  let k = 0
  const THETA = math.bignumber(0.00001)
  let d0 = math.bignumber(rate)
  let d1 = d0
  while (!stable && k < 1000) {
    // Newton-Raphson: x1 = x0 - f(x)/f'(x)
    d1 = math.subtract(d0, math.divide(npv(cf, d0), npvdx(cf, d0)))
    stable = math.smallerEq(math.abs(math.subtract(d1, d0)), THETA)
    k++
    d0 = d1
  }
  return d1
}

function Periods({ settlement = moment(), exit, frequency = 2 }) {
  const TARGET_DATE = exit.date()
  const MONTH_DELTA = 12 / frequency

  let dates = []
  let last = moment(exit)

  while (last > settlement) {
    dates.unshift(last)
    let m1 = (12 + last.month() - MONTH_DELTA) % 12
    let y1 = m1 < last.month() ? last.year() : last.year() - 1
    let daysInMonth = moment({ year: y1, month:m1 }).daysInMonth()

    last = moment({
      year: y1,
      month: m1,
      date: Math.min(TARGET_DATE, daysInMonth)
    })
  }
  dates.unshift(settlement)

  return {
    dates,
    get last() {
      return this.dates[this.dates.length - 1]
    }
  }
}

function CashFlow({ periods, rate, cleanPx, redemptionPx = 100, notional = 100, dayCount = 365 }) {
  let scope = {
    rate: math.bignumber(rate),
    notional: math.bignumber(notional),
    cleanPx: math.bignumber(cleanPx),
    redemptionPx: math.bignumber(redemptionPx)
  }

  let cf = {
    pmts: [],
    set exit(px) {
      let pmt = this.last
      pmt.principal = math.bignumber(px)
    },
    get first() {
      return this.pmts[0]
    },
    get last() {
      return this.pmts[this.pmts.length - 1]
    }
  }

  let dates = periods.dates.slice(1)
  let last = periods.dates[0]

  const cNode = math.parse('pct * rate * notional')
  const cCode = cNode.compile()

  while (dates.length > 0) {
    let next = dates.shift()
    let accrued = next.diff(last, 'days')

    scope.pct = math.bignumber(accrued / dayCount)

    cf.pmts.push(Payment({ coupon: cCode.eval(scope), date: next }))
    last = next
  }

  let entry = Payment({ date: moment(periods.dates[0]), principal: math.unaryMinus(scope.cleanPx) })
  cf.pmts.unshift(entry)
  cf.exit = scope.redemptionPx
  return cf
}

function npv(cf, r) {
  function pv(pmt, r) {
    const pvNode = math.parse('fv / e^(r * t)')
    const pvCode = pvNode.compile()

    let accrued = pmt.date.diff(moment(), 'days')
    let dayCount = 365
    let scope = {
      t: math.bignumber(accrued / dayCount),
      r: r,
      fv: math.add(pmt.coupon, pmt.principal)
    }
    return pvCode.eval(scope)
  }

  let pmts = cf.pmts.slice(1)
  return  pmts.reduce((acc, pmt) => math.add(acc, pv(pmt, r)), math.bignumber(cf.first.principal))
}

function npvdx(cf, r) {
  function pvdx(pmt, r) {
    const pvNode = math.parse('-fv * t / e^(r*t)')
    const pvCode = pvNode.compile()

    let accrued = pmt.date.diff(moment(), 'days')
    let dayCount = 365
    let scope = {
      t: math.bignumber(accrued / dayCount),
      r: r,
      fv: math.add(pmt.coupon, pmt.principal)
    }
    return pvCode.eval(scope)
  }

  let pmts = cf.pmts.slice(1)
  return pmts.reduce((acc, pmt) => math.add(acc, pvdx(pmt, r)), 0)
}

let Payment = function({ date, coupon = 0, principal = 0 }) {
  return {
    date,
    coupon: math.bignumber(coupon),
    principal: math.bignumber(principal)
  }
}

if (require.main === module) {
  let exit = moment({ year: 2023, month: 11, date: 28 })
  let rate = math.bignumber(0.055)
  let cleanPx = math.bignumber(100)

  let bondYield = Yielder({ rate, cleanPx, exit })
  console.log('bond yield:', bondYield.toString())

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
  module.exports = Yielder
}
