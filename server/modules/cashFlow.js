let moment = require('moment')
let math = require('mathjs')
let Calc = require('./calculator')

math.config({
  number: 'BigNumber',
  precision: 64
})

function Payment({ date, coupon = 0, principal = 0 }) {
  return {
    date,
    coupon: math.bignumber(coupon),
    principal: math.bignumber(principal)
  }
}

let CashFlow = function({ periods, rate, cleanPx, redemptionPx = 100, notional = 100, dayCount = 365 }) {
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

  let entry = Payment({
    date: moment(periods.first),
    principal: Calc.neg(cleanPx)
  })
  cf.pmts.push(entry)

  let [last, ...dates] = periods.dates.slice()
  while (dates.length > 0) {
    let next = dates.shift()
    let accrued = next.diff(last, 'days')
    let t = math.bignumber(accrued / dayCount)

    let pmt = Payment({
      coupon: Calc.couponPmt({ t, r: rate, p: notional }),
      date: next
    })
    cf.pmts.push(pmt)
    last = next
  }

  cf.exit = redemptionPx
  return cf
}

module.exports = CashFlow
