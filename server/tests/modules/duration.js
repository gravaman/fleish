let test = require('tape')
let moment = require('moment')
let math = require('mathjs')
let CashFlow = require('../../modules/cashFlow')
let Periods = require('../../modules/periods')
let Calc = require('../../modules/calculator')
let Pver = require('../../modules/pver')
let Payment = require('../../modules/payment')
let { mDuration } = require('../../modules/duration')
let { yld } = require('../../modules/yielder')

function getCf(r, cleanPx, exit) {
  let periods = Periods({ exit })
  return CashFlow({ periods, r, cleanPx })
}

function getPvs(cf, rm, frequency) {
  let rc = Calc.continuousM({ m: frequency, rm })

  return cf.fvs.map(fv => {
    return Payment({
      date: fv.date,
      coupon: Calc.pv({ fv: fv.coupon, r: rc, t: fv.timeFromNow() }),
      principal: Calc.pv({ fv: fv.principal, r: rc, t: fv.timeFromNow() })
    })
  })
}

let tests = [
  {
    msg: 'D === 1 when r is 0',
    code: (t) => {
      t.plan(1)
      let cleanPx = 100
      let r = 0
      let m = 2
      let today = moment()
      let exit = today.add(366, 'days')

      let cf = getCf(r, cleanPx, exit)
      let pvs = getPvs(cf, r, m)

      let result = mDuration({ px: cleanPx, y: r, m, pvs })
      result = math.format(result, 2)
      let expected = 1
      t.equal(result, expected.toString())
    }
  },
  {
    msg: 'D === 0.928 when r: 0.1, m:2, cleanPx: 100, maturity: 1yr',
    code: (t) => {
      t.plan(1)

      let cleanPx = 100
      let r = 0.1
      let m = 2
      let today = moment()
      let exit = today.add(365, 'days')
      let cf = getCf(r, cleanPx, exit)
      let pvs = getPvs(cf, r, m)
      let result = mDuration({ px: cleanPx, y:r, m, pvs })

      result = math.round(result, 3)
      let expected = 0.928

      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'B1 === B0 * (1 - Ddy)',
    code: (t) => {
      t.plan(1)

      let cleanPx = 100
      let r = 0.1
      let dy = 0.001
      let r2 = r + dy
      let m = 2
      let today = moment()
      let exit = today.add(365, 'days')
      let cf = getCf(r, cleanPx, exit)
      let pvs = getPvs(cf, r, m)
      let mD = mDuration({px: cleanPx, y:r, m, pvs })

      let b0 = pvs.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)
      let b1 = Calc.multiply(b0, Calc.subtract(1, Calc.multiply(mD, dy)))

      let pvs2 = getPvs(cf, r2, m)
      let npv2 = pvs2.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)

      let result = math.round(b1, 3)
      let expected = math.round(npv2, 3)
      t.equal(result.toString(), expected.toString())
    }
  }
]

tests.forEach(t => test(t.msg, t.code))
