let test = require('tape')
let moment = require('moment')
let DayCounter = require('../../modules/dayCounter')
let Calendar = require('../../modules/calendar')
let Calculator = require('../../modules/calculator')

function expFactor(num, m = 2) {
  return Calculator.divide(num, 360 / m)
}

let tests = [
  {
    msg: 'y1 === y2',
    code: (t) => {
      t.plan(1)
      let dt1 = Calendar.randomDate()
      let dt2 = moment(dt1)
      let result = DayCounter.yearVar(dt1, dt2)
      t.equal(result, 0)
    }
  },
  {
    msg: 'y1 !== y2',
    code: (t) => {
      t.plan(1)
      let dt1 = Calendar.randomDate()
      let dt2 = Calendar.randomDate()

      let delta = 3
      let expected = delta * 360
      dt2.year(dt1.year() + delta)

      let result = DayCounter.yearVar(dt1, dt2)
      t.equal(result, expected)
    }
  },
  {
    msg: 'm1 === m2',
    code: (t) => {
      t.plan(1)
      let dt1 = Calendar.randomDate()
      let dt2 = moment(dt1)
      let result = DayCounter.monthVar(dt1, dt2)
      t.equal(result, 0)
    }
  },
  {
    msg: 'm1 !== m2',
    code: (t) => {
      t.plan(1)
      let dt1 = Calendar.randomDate()
      let dt2 = moment(dt1)
      let m2 = Calendar.randomMonth({ exclude: dt1.month() })
      dt2.month(m2)

      let expected = (m2 - dt1.month()) * 30
      let result = DayCounter.monthVar(dt1, dt2)
      t.equal(result, expected)
    }
  },
  {
    msg: 'both feb eom1',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2021, month: 1, date: 28 })
      let dt2 = moment({ year: 2022, month: 1, date: 15 })

      let expVar = (dt2.year() - dt1.year()) * 360 + dt2.date() - 30
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom1 (dt1 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2020, month: 1, date: 29 })
      let dt2 = moment({ year: 2021, month: 1, date: 15 })

      let expVar = (dt2.year() - dt1.year()) * 360 + dt2.date() - 30
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom2',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2021, month: 1, date: 13 })
      let dt2 = moment({ year: 2022, month: 1, date: 28 })

      let expVar = (dt2.year() - dt1.year()) * 360 + dt2.date() - dt1.date()
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom2 (dt2 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2021, month: 1, date: 17 })
      let dt2 = moment({ year: 2024, month: 1, date: 29 })

      let expVar = (dt2.year() - dt1.year()) * 360 + dt2.date() - dt1.date()
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom1 eom2 (dt1 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2020, month: 1, date: 29 })
      let dt2 = moment({ year: 2021, month: 1, date: 28 })

      let expVar = (dt2.year() - dt1.year()) * 360
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom1 eom2 (dt2 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2021, month: 1, date: 28 })
      let dt2 = moment({ year: 2024, month: 1, date: 29 })

      let expVar = (dt2.year() - dt1.year()) * 360
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'both feb eom1 eom2 (dt1 dt2 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2020, month: 1, date: 29 })
      let dt2 = moment({ year: 2024, month: 1, date: 29 })

      let expVar = (dt2.year() - dt1.year()) * 360
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'd2: 31 d1: (31 || 30)',
    code: (t) => {
      t.plan(2)
      let dt1 = moment({ year: 2020, month: 9, date: 31 })
      let dt2 = moment({ year: 2025, month: 11, date: 31 })
      let dt3 = moment({ year: 2025, month: 10, date: 30 })

      let expVar1 = (dt2.year() - dt1.year()) * 360 + (dt2.month() - dt1.month()) * 30
      let expected1 = expFactor(expVar1)
      let result1 = DayCounter.factor(dt1, dt2)

      let expVar2 = (dt3.year() - dt1.year()) * 360 + (dt3.month() - dt1.month()) * 30
      let expected2 = expFactor(expVar2)
      let result2 = DayCounter.factor(dt1, dt3)

      t.equal(result1.toString(), expected1.toString())
      t.equal(result2.toString(), expected2.toString())
    }
  },
  {
    msg: 'd1: 31 d2: 29 (dt2 leap)',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2020, month: 9, date: 31 })
      let dt2 = moment({ year: 2024, month: 1, date: 29 })

      let expVar = (dt2.year() - dt1.year()) * 360 + (dt2.month() - dt1.month()) * 30 + dt2.date() - 30
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  },
  {
    msg: 'd2: !eom d1: 30',
    code: (t) => {
      t.plan(1)
      let dt1 = moment({ year: 2020, month: 10, date: 30 })
      let dt2 = moment({ year: 2025, month: 1, date: 12 })

      let expVar = (dt2.year() - dt1.year()) * 360 + (dt2.month() - dt1.month()) * 30 + dt2.date() - dt1.date()
      let expected = expFactor(expVar)
      let result = DayCounter.factor(dt1, dt2)
      t.equal(result.toString(), expected.toString())
    }
  }
]

tests.forEach(t => test(t.msg, t.code))
