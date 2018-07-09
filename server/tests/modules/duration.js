let test = require('tape')
let moment = require('moment')
let CashFlow = require('../../modules/cashFlow')
let Periods = require('../../modules/periods')
let Calc = require('../../modules/calculator')
let Payment = require('../../modules/payment')
let { getPvs } = require('../../modules/pver')
let DurationFactory = require('../../modules/duration')

function getCf(props) {
  let { rm, px, settlement, exit } = props
  let periods = Periods({ settlement, exit })
  return CashFlow({ periods, r: rm, cleanPx: px })
}

let defaultArgs = {
  rm: 0.1,
  m: 2,
  px: 100,
  settlement: moment().add(2, 'days'),
  exit: moment().add(367, 'days')
}

function defaultHandler(args = {}) {
  let props = Object.assign({}, defaultArgs)
  Object.assign(props, args)
  let { rm, m, px, settlement, exit } = props

  if (!exit) {
    exit = moment(props.settlement).add(365, 'days')
  }
  let { fvs, first } = getCf({ rm, px, settlement, exit })
  return DurationFactory({ fvs, m, y: rm, px, entry: first })
}

let tests = [
  {
    msg: 'D === maturity when r is 0',
    code: (t) => {
      t.plan(1)
      let handler = defaultHandler({ rm: 0 })

      let result = Calc.round(handler.macD, 2)
      let expected = 1

      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'D* === 0.93 when r: 0.1, m:2, px: 100, maturity: 1yr',
    code: (t) => {
      t.plan(1)

      let handler = defaultHandler()

      let result = Calc.round(handler.modD, 2)
      let expected = 0.93

      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'Macaulay Convexity Test',
    code: (t) => {
      t.plan(1)

      let handler = defaultHandler()

      let result = Calc.round(handler.macC)

      let cf = getCf({ ...defaultArgs })
      let pvs = getPvs({ fvs: cf.fvs, rm: defaultArgs.rm, m: defaultArgs.m, entry: cf.first })
      let weighted = pvs.reduce((acc, pv) => {
        let t2 = Calc.pow(pv.timeFromDate(defaultArgs.settlement), 2)
        return Calc.add(acc, Calc.multiply(pv.amount, t2))
      }, 0)
      let expected = Calc.round(Calc.divide(weighted, defaultArgs.px))

      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'Modified Convexity Test',
    code: (t) => {
      t.plan(1)

      let handler = defaultHandler()

      let result = Calc.round(handler.modC)

      let num = Calc.add(handler.macC, Calc.divide(handler.macD, defaultArgs.m))
      let denom = Calc.pow(Calc.add(1, Calc.divide(defaultArgs.rm, defaultArgs.m)), 2)
      let expected = Calc.round(Calc.divide(num, denom))

      t.equal(result.toString(), expected.toString())
    }
  }
  // {
  //   msg: 'B1 === B0 * (1 - Ddy)',
  //   code: (t) => {
  //     t.plan(1)
  //
  //     let px = 100
  //     let rm = 0.1
  //     let dy = 0.001
  //     let rm2 = rm + dy
  //     let m = 2
  //     let today = moment()
  //     let exit = today.add(365, 'days')
  //     let cf = getCf(rm, px, exit)
  //     let pvs = getPvs({ fvs: cf.fvs, rm, m })
  //     let mD = mDuration({px, rm, m, fvs: cf.fvs })
  //
  //     let b0 = pvs.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)
  //     let b1 = Calc.multiply(b0, Calc.subtract(1, Calc.multiply(mD, dy)))
  //
  //     let pvs2 = getPvs({ fvs: cf.fvs, rm: rm2, m })
  //     let npv2 = pvs2.reduce((acc, pv) => Calc.add(acc, pv.amount), 0)
  //
  //     let result = Calc.round(b1)
  //     let expected = Calc.round(npv2)
  //
  //     t.equal(result.toString(), expected.toString())
  //   }
  // }
]

// test modC
// test px chg

tests.forEach(t => test(t.msg, t.code))
