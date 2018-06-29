let moment = require('moment')
let math = require('mathjs')
let Calendar = require('./calendar')
let Calculator = require('./calculator')

const US_30_360 = Symbol.for('30/360 US Bond Basis')

function Convention(key) {
  switch (key) {
    case US_30_360:
      return {
        daysInMonth: 30,
        daysInYear: 360,
        leapEOM: 29,
        febEOM: 28
      }
    default:
      throw `could not identify day count convention: (${ key })`
  }
}

function yearVar(dt1, dt2, { convention = Convention(US_30_360) } = {}) {
  return (dt2.year() - dt1.year()) * convention.daysInYear
}

function monthVar(dt1, dt2, { convention = Convention(US_30_360 ) } = {}) {
  return (dt2.month() - dt1.month()) * convention.daysInMonth
}

function dayVar(dt1, dt2, { convention = Convention(US_30_360 ) } = {}) {
  let d1 = dt1.date()
  let d2 = dt2.date()

  let m1 = dt1.month()
  let m2 = dt2.month()

  let eom1 = Calendar.isEndOfMonth(dt1)
  let eom2 = Calendar.isEndOfMonth(dt2)

  if (m1 === m2  && m2 === 1) {
    if (eom1) {
      d1 = convention.daysInMonth
    }

    if (eom1 && eom2) {
      d2 = convention.daysInMonth
    }
  }

  if (d2 > convention.daysInMonth && d1 >= convention.daysInMonth) {
    d2 = convention.daysInMonth
  }

  if (d1 > convention.daysInMonth) {
    d1 = convention.daysInMonth
  }

  return d2 - d1
}

function accrued(dt1, dt2, { convention = Convention(US_30_360) } = {}) {
  let d = dayVar(dt1, dt2, { convention })
  let y = yearVar(dt1, dt2, { convention })
  let m = monthVar(dt1, dt2, { convention })

  return y + m + d
}

function factor(...args) {
  return Calculator.divide(accrued(...args), 360)
}

module.exports = {
  yearVar,
  monthVar,
  dayVar,
  accrued,
  factor
}
