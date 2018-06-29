let moment = require('moment')
let Calc = require('./calculator')
let DayCounter = require('./dayCounter')

function Payment({ date, coupon = 0, principal = 0 }) {
  return { date, coupon, principal }
}

let CashFlow = function({ periods, r, cleanPx, redemptionPx = 100, notional = 100, convention = DayCounter.Conventions.US_30_360, frequency = 2 } = {}) {
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

  let entry = Payment({
    date: moment(periods.first),
    principal: Calc.neg(cleanPx)
  })
  cf.pmts.push(entry)

  let [last, ...dates] = periods.dates.slice()
  while (dates.length > 0) {
    let next = dates.shift()
    let t = DayCounter.factor(last, next, { convention, frequency })

    let pmt = Payment({
      coupon: Calc.couponPmt({ t, r, m: frequency, p: notional }),
      date: next
    })
    cf.pmts.push(pmt)
    last = next
  }

  cf.exit = redemptionPx
  return cf
}

module.exports = CashFlow
