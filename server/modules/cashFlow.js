let moment = require('moment')
let Calc = require('./calculator')
let DayCounter = require('./dayCounter')

function Payment({ date, coupon = 0, principal = 0 }) {
  return { date, coupon, principal }
}

let CashFlow = {
  setState: function(update) {
    Object.assign(this.state, update)
  },
  build: function() {
    let { periods, redemptionPx, convention, frequency } = this.state

    this.setEntry()

    let isFirst = true
    let [last, ...dates] = periods.state.dates.slice()
    while (dates.length > 0) {
      let next = dates.shift()
      if (isFirst) {
        last = periods.prior(next)
        isFirst = false
      }
      let t = DayCounter.factor(last, next, { convention, frequency })
      this.addPmt({ date: next, factor: t })
      last = next
    }

    this.exit = redemptionPx
  },
  setEntry: function() {
    let { periods, pmts } = this.state
    pmts = pmts.slice()
    let entryPx = this.dirtyPx()

    let entry = Payment({
      date: moment(periods.first),
      principal: Calc.neg(entryPx)
    })
    pmts.push(entry)
    this.setState({ pmts })
  },
  dirtyPx: function() {
    let { cleanPx, frequency, convention, periods, r, notional } = this.state
    let { dates } = periods.state

    let last = periods.prior(dates[1])
    let factor = DayCounter.factor(last, periods.first, { convention, frequency })
    let accrued = Calc.couponPmt({ t: factor, r, m: frequency, p: notional })
    return Calc.add(accrued, cleanPx)
  },
  addPmt: function({ date, factor }) {
    let { r, frequency, notional, pmts } = this.state
    pmts = pmts.slice()

    let pmt = Payment({
      coupon: Calc.couponPmt({ t: factor, r, m: frequency, p: notional }),
      date
    })
    pmts.push(pmt)
    this.setState({ pmts })
  },
  get pmts() {
    return this.state.pmts
  },
  set exit(px) {
    let pmt = this.last
    pmt.principal = px
  },
  get first() {
    let { pmts } = this.state
    return pmts[0]
  },
  get last() {
    let { pmts } = this.state
    return pmts[pmts.length - 1]
  }
}

function CashFlowFactory({ periods, r, cleanPx, redemptionPx = 100, notional = 100, convention = DayCounter.Conventions.US_30_360, frequency = 2 } = {}) {
  let cf = Object.create(CashFlow)
  cf.state = {
    pmts: [],
    periods,
    r,
    cleanPx,
    redemptionPx,
    notional,
    convention,
    frequency
  }
  cf.build()
  cf.dirtyPx()
  return cf
}

module.exports = CashFlowFactory
