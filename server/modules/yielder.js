let moment = require('moment')

let Yielder = function({ rate, cleanPx, redemptionPx = 100, notional = 100, settlement = moment(), exit, frequency = 2, dayCount = 360 }) {
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, rate, cleanPx, redemptionPx, notional, dayCount })

  let stable = false
  let k = 0
  const THETA = 0.0001
  let d0 = rate
  let d1
  while (!stable && k < 1000) {
    // Newton-Raphson: x1 = x0 - f(x)/f'(x)
    let d1 = d0 - npv(cf, d0) / npvDx(cf, d0)
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

  return {
    dates,
    get last() {
      return this.dates[this.dates.length - 1]
    }
  }
}

function CashFlow({ periods, rate, cleanPx, redemptionPx = 100, notional = 100, dayCount = 360 }) {
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

  let dates = periods.dates.slice(1, periods.dates.length - 1)
  dates.forEach((date, i) => {
    let next = periods.dates[i + 2]
    let coupon = next.diff(date, 'days') / dayCount * rate * notional
    cf.pmts.push(Payment({ coupon, date }))
  })

  let entry = Payment({ date: moment(periods.dates[0]), principal: -cleanPx })
  cf.pmts.unshift(entry)
  cf.exit = redemptionPx
  return cf
}

function npv(cf, d) {
  function pv(pmt, d) {
    let settlement
    return (pmt.coupon + pmt.principal) / (1 + d)^((pmt.date - settlement)/365)
  }

  let cf1 = cf.slice(1)
  return cf1.reduce((acc, pmt) => acc + pv(pmt, d)) - cf[0]
}

function npvDx(cf, d) {
  function pvdx(pmt, d) {
    let settlement
    let t = (pmt.date - settlement) / 365
    return (pmt.coupon + pmt.principal) / (t * (1 + d)^(t - 1))
  }

  let cf1 = cf.slice(1)
  return cf1.reduce((acc, pmt) => acc + pvdx(pmt, d))
}

let Payment = function({ date, coupon = 0, principal = 0 }) {
  return {
    coupon,
    date,
    principal
  }
}

if (require.main === module) {
  let exit = moment({ year: 2023, month: 7, date: 31 })
  let rate = 0.055
  let cleanPx = 98

  let periods = Periods({ exit })
  let cf = CashFlow({ periods, rate, cleanPx })
  console.log('the cf:', cf)
} else {
  module.exports = Yielder
}
