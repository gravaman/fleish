let test = require('tape')
let moment = require('moment')
let CashFlow = require('../../modules/cashFlow')
let Periods = require('../../modules/periods')
let Calc = require('../../modules/calculator')
let Payment = require('../../modules/payment')
let { npvm, getPvs } = require('../../modules/pver')
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

      let cf = getCf(defaultArgs)
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
  },
  {
    msg: 'Price Approximation Test',
    code: (t) => {
      t.plan(1)

      let handler = defaultHandler()
      let ydelta = 0.001
      let result = Calc.round(handler.pxDelta(ydelta), 2)

      let px0 = defaultArgs.px
      let cf = getCf(defaultArgs)
      let y1 = Calc.add(defaultArgs.rm, ydelta)
      let px1 = npvm(cf.fvs, y1, defaultArgs.m, Payment({ date: defaultArgs.settlement }))
      let expected = Calc.round(Calc.subtract(px1, px0), 2)

      t.equal(result.toString(), expected.toString())
    }
  }
]

tests.forEach(t => test(t.msg, t.code))
