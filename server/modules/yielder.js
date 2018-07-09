let moment = require('moment')
let Calc = require('./calculator')
let CashFlow = require('./cashFlow')
let Periods = require('./periods')
let DayCounter = require('./dayCounter')
let Pver = require('./pver')

function yld({ r, cleanPx, redemptionPx = 100, notional = 100, trade = moment(), exit, frequency = 2, convention = DayCounter.Conventions.US_30_360 }) {
  let settlement = moment(trade).add(2, 'days')
  let periods = Periods({ settlement, exit, frequency })
  let cf = CashFlow({ periods, r, cleanPx, redemptionPx, notional, convention })

  let stable = false
  let k = 0
  let x0 = r
  let x1 = x0
  while (!stable && k < 1000) {
    x1 = Calc.newtRoot({
      x0,
      y: Pver.npv(cf.fvs, x0, cf.first),
      dy: Pver.npvdx(cf.fvs, x0, cf.first)
    })
    stable = Calc.stable({ x1, x0, theta: 0.00001 })
    k++
    x0 = x1
  }

  // match compounding rate with frequency
  return Calc.compoundM({ m: frequency, rc: x1 })
}

if (require.main === module) {
  let trade = moment()
  let exit = moment({ year: 2023, month: 6, date: 8 })
  let r = 0.055
  let cleanPx = 100

  let y1 = yld({ r, cleanPx, trade, exit })
  console.log('yield:', y1.toString())
} else {
  module.exports = { yld }
}
