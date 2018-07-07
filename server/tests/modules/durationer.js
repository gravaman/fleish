let test = require('tape')
let moment = require('moment')
let CashFlow = require('../../modules/cashFlow')
let Periods = require('../../modules/periods')
let Durationer = require('../../modules/durationer')
let Calc = require('../../modules/calculator')
let { yld } = require('../../modules/yielder')

function getCf(r, cleanPx, exit) {
  let periods = Periods({ exit })
  return CashFlow({ periods, r, cleanPx })
}

// pvs of cf, not fvs
// pass in clean price and get dirty price

let tests = [
  {
    msg: 'r: 0%, exit: 1 yr, px: 100',
    code: (t) => {
      t.plan(1)
      let cleanPx = 100
      let r = 0
      let today = moment()
      let exit = today.add(366, 'days')

      let cf = getCf(r, cleanPx, exit)

      let result = Durationer.getDuration(cleanPx, cf.fvs)
      let expected = 1
      t.equal(result.toString(), expected.toString())
    }
  }
]

// {
//   msg: 'B1 === B0(1 - Ddy)',
//   code: (t) => {
//     t.plan(1)
//     let dy = 0.001
//
//     let cleanPx = 100
//     let r = 0.1
//     let today = moment()
//     let exit = today.add(366, 'days')
//
//     let cf = getCf(r, cleanPx, exit)
//     let d = Durationer.getDuration(cleanPx, cf)
//     let diff = 1 - Calc.multiply(d, dy)
//     let result = Calc.multiply(cleanPx, diff)
//
//     // get yield
//     let bondYld = yld({ r, cleanPx, exit })
//     let rc0 = Calc.continuousM({ m: 2, rm: bondYld })
//     let rc1 = Calc.add(rc0, dy)
//
//     // get npv for updated yield
//     let fvs = cf.pmts.slice(1)
//     let dts = fvs.map(fv => fv.date)
//     let times = dts.map(dt => Calendar.yearsFromToday(dt))
//     let expected = fvs.reduce((acc, fv, i) => Calc.pv({ fv, r: rc1, t: times[i] }))
//     t.equal(result.toString(), expected.toString())
//   }
// }

tests.forEach(t => test(t.msg, t.code))
