let test = require('tape')
let moment = require('moment')
let math = require('mathjs')
let Periods = require('../../modules/periods')
let CashFlow = require('../../modules/cashFlow')
let Pver = require('../../modules/pver')
let Calc = require('../../modules/calculator')

let tests = [
  {
    msg: 'npv = fve^-rt',
    code: (t) => {
      t.plan(1)

      let settlement = moment().add(2, 'days')
      let exit = moment(settlement).add(365, 'days')
      let frequency = 1
      let rm = 0.1
      let rc = Calc.continuousM({ m: frequency, rm })
      let cleanPx = 100

      let periods = Periods({ settlement, exit, frequency })
      let cf = CashFlow({ periods, r: rm, cleanPx, frequency })
      let { fvs, first } = cf

      let result = math.round(Pver.npv(fvs, rc, first), 3)
      let expected = 0

      t.equal(result.toString(), expected.toString())
    }
  }
]

tests.forEach(t => test(t.msg, t.code))
