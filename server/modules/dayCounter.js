let moment = require('moment')
let math = require('mathjs')

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

function accrued(dt1, dt2, { convention = Convention(US_30_360) } = {}) {
  let d1 = dt1.date()
  let d2 = dt2.date()

  if (d1 == d2 == (convention.leapEOM || convention.febEOM)) {
    d2 = convention.daysInMonth
  }

  if (d1 === (convention.leapEOM || convention.febEOM)) {
    d1 = convention.daysInMonth
  }

  if (d2 > convention.daysInMonth && d1 >= convention.daysInMonth) {
    d2 = convention.daysInMonth
  }

  if (d1 > convention.daysInMonth) {
    d1 = convention.daysInMonth
  }

  let d = d2 - d1
  let y = (dt2.year() - dt1.year()) * convention.daysInYear
  let m = (dt2.month() - dt1.month()) * convention.daysInMonth

  return y + m + d
}

module.exports = {
  accrued
}
