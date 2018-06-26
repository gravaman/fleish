let moment = require('moment')

let Yielder = function({ rate, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, dayCount = 365 }) {
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, rate, cleanPx, redemptionPx, notional, dayCount })

  let stable = false
  let k = 0
  const THETA = 0.00001
  let d0 = rate
  let d1
  while (!stable && k < 1000) {
    // Newton-Raphson: x1 = x0 - f(x)/f'(x)
    d1 = d0 - npv(cf, d0) / npvdx(cf, d0)
    stable = Math.abs(d1 - d0) <= THETA
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
  let cf = {
    pmts: [],
    set exit(px) {
      let pmt = this.last
      pmt.principal = px
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

  while (dates.length > 0) {
    let next = dates.shift()
    let coupon = next.diff(last, 'days') / dayCount * rate * notional
    cf.pmts.push(Payment({ coupon, date: next }))
    last = next
  }

  let entry = Payment({ date: moment(periods.dates[0]), principal: -cleanPx })
  cf.pmts.unshift(entry)
  cf.exit = redemptionPx
  return cf
}

function npv(cf, d) {
  function pv(pmt, d) {
    let t = pmt.date.diff(moment(), 'days') / 365
    return (pmt.coupon + pmt.principal) / Math.exp(d * t)
  }

  let pmts = cf.pmts.slice(1)
  return pmts.reduce((acc, pmt) => acc + pv(pmt, d), cf.first.principal)
}

function npvdx(cf, d) {
  function pvdx(pmt, d) {
    let t = pmt.date.diff(moment(), 'days') / 365
    return (-(pmt.coupon + pmt.principal) * t) / Math.exp(d * t)
  }

  let pmts = cf.pmts.slice(1)
  return pmts.reduce((acc, pmt) => acc + pvdx(pmt, d), 0)
}

let Payment = function({ date, coupon = 0, principal = 0 }) {
  return {
    coupon,
    date,
    principal
  }
}

if (require.main === module) {
  let exit = moment({ year: 2023, month: 11, date: 28 })
  let rate = 0.055
  let cleanPx = 100

  let bondYield = Yielder({ rate, cleanPx, exit })

  let periods = Periods({ exit })
  let pmtDates = periods.dates.slice(1)

  let entry = periods.dates[0]
  let m1 = (12 + entry.month() - 6) % 12
  let y1 = m1 < entry.month() ? entry.year() : entry.year() - 1
  let daysInMonth = moment({ year: y1, month:m1 }).daysInMonth()

  let last = moment({
    year: y1,
    month: m1,
    date: Math.min(exit.date(), daysInMonth)
  })

  let accruedPct = entry.diff(last, 'days') / pmtDates[0].diff(last, 'days')
  console.log('accruedPct:', accruedPct)

  let annuity = pmtDates.reduce((acc, date, i) => {
    let t = date.diff(moment(), 'days') / 365
    let inc = Math.exp(-bondYield * t)
    if (i === 0) {
      inc *= (1 - accruedPct)
    }
    return acc + inc
  }, 0)

  let t = exit.diff(moment(), 'days') / 365
  let terminal = 100 * Math.exp(-bondYield * t)
  let parYield = (100 - terminal) * 2 / annuity

  console.log('bond yield:', bondYield)
  console.log('par yield:', parYield)

} else {
  module.exports = Yielder
}
