let test = require('tape')
let moment = require('moment')
let CashFlow = require('../../modules/cashFlow')
let Periods = require('../../modules/periods')
let Calc = require('../../modules/calculator')
let Payment = require('../../modules/payment')
let { getPvs } = require('../../modules/pver')
let { mDuration } = require('../../modules/duration')

function getCf(r, cleanPx, exit) {
  let periods = Periods({ exit })
  return CashFlow({ periods, r, cleanPx })
}

let tests = [
  {
    msg: 'D === 1 when r is 0',
    code: (t) => {
      t.plan(1)
      let px = 100
      let rm = 0
      let m = 2
      let today = moment()
      let exit = today.add(366, 'days')

      let cf = getCf(rm, px, exit)
      // let pvs = getPvs({ fvs: cf.fvs, rm: r, m })

      let result = Calc.round(mDuration({ px, rm, m, fvs: cf.fvs }), 2)
      let expected = 1
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'D === 0.928 when r: 0.1, m:2, px: 100, maturity: 1yr',
    code: (t) => {
      t.plan(1)

      let px = 100
      let rm = 0.1
      let m = 2
      let today = moment()
      let exit = today.add(365, 'days')
      let cf = getCf(rm, px, exit)
      // let pvs = getPvs({ fvs: cf.fvs, rm: r, m })

      let result = Calc.round(mDuration({ px, rm, m, fvs: cf.fvs }))
      let expected = 0.928

      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'B1 === B0 * (1 - Ddy)',
    code: (t) => {
      t.plan(1)

      let px = 100
      let rm = 0.1
      let dy = 0.001
      let rm2 = rm + dy
      let m = 2
      let today = moment()
      let exit = today.add(365, 'days')
      let cf = getCf(rm, px, exit)
      let pvs = getPvs({ fvs: cf.fvs, rm, m })
      let mD = mDuration({px, rm, m, fvs: cf.fvs })

      let b0 = pvs.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)
      let b1 = Calc.multiply(b0, Calc.subtract(1, Calc.multiply(mD, dy)))

      let pvs2 = getPvs({ fvs: cf.fvs, rm: rm2, m })
      let npv2 = pvs2.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)

      let result = Calc.round(b1)
      let expected = Calc.round(npv2)

      t.equal(result.toString(), expected.toString())
    }
  }
]

tests.forEach(t => test(t.msg, t.code))
