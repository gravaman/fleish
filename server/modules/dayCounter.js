let moment = require('moment')
let math = require('mathjs')

const US_30_360 = Symbol.for('30/360 US Bond Basis')

function Convention(key) {
  switch (key) {
    case [US_30_360]:
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

function DayCounter() {
  factor({ start, end = moment()}) {
    let convention = Convention(dayCount)
    start = moment(start)
    end = moment(end)

    let yearVar = (end.year() - start.year()) * convention.daysInYear
    let monthVar = (end.month() - start.month()) * convention.daysInMonth

    let d2 = end.date()
    let d1 = start.date()

    let eof2 = end.isLeapYear() ? convention.leapEOM : convention.febEOM
    let eof1 = start.isLeapYear() ? convention.leapEOM : convention.febEOM

    if (d2 === d1 === eof2) {
      d2 = convention.daysInMonth
    }

    if (d1 === eof1) {
      d1 = convention.daysInMonth
    }

    if (d2 > convention.daysInMonth && d1 >= convention.daysInMonth) {
      d2 = convention.daysInMonth
    }

    if (d1 > convention.daysInMonth) {
      d1 = convention.daysInMonth
    }
    let dayVar = d2 - d1

    return (yearVar + monthVar + dayVar) / convention.daysInYear
  }
}

module.exports = DayCounter
