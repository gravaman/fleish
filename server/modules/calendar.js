let moment = require('moment')
let { Range, selectRandom, randomInclusive } = require('./utilities')

const MONTHS = {
  ALL: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  FEB: 1,
  EX_FEB: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  DAYS_31: [0, 2, 4, 6, 7, 9, 11],
  DAYS_30: [3, 5, 8, 10]
}

let Calendar = {
  has31: (month) => MONTHS.DAYS_31.includes(month),
  has30: (month) => MONTHS.DAYS_30.includes(month),
  isEndOfMonth: (d, { month }) => {
    return month ? d.month() === month && d.date() === d.daysInMonth() : d.date() === d.daysInMonth()
  },
  isLeapYear: (year) => moment([year]).isLeapYear(),
  notLeapYear: (year) => !Calendar.isLeapYear(year),
  isLeapDay: (d) => d.date() === 29,
  daysInMonth: (month, leap = false) => {
    if (Calendar.has31(month)) {
      return 31
    }
    if (Calendar.has30(month)) {
      return 30
    }
    return leap ? 29 : 28
  },
  mToString: (m) => ('0' + m).slice(-2),
  randomYear: ({ min = moment().year(), length = 10, leap = true, exclude = null } = {}) => {
    let years = Range({ start: min, length })
    if (!leap) {
      years = years.filter(year => Calendar.notLeapYear(year))
    }

    if (!exclude) {
      return selectRandom(years)
    }

    let year = selectRandom(years)
    let k = 0
    while (exclude === year && k < 100) {
      year = selectRandom(years)
      k++
    }
    if (k === 100) {
      throw `could not select random year!`
    }
    return year
  },
  randomMonth: ({ min = 0, length = 11, leap = true } = {}) => {
    let mos = Range({ start: min + 1, length })
    if (!leap) {
      mos = mos.filter(month => month !== 1)
    }
    return selectRandom(mos)
  },
  randomDay: (month, { leap = month === 1, min = 1, max = Calendar.daysInMonth(month, month === 1), eom = true, length } = {}) => {
    length = Calendar.daysInMonth(month, leap)
    let day = selectRandom(Range({ start: min, length }))
    if (eom) {
      return day
    }

    let k = 0
    while (Calendar.daysInMonth(month, leap) === day && k < 100) {
      day = selectRandom(Range({ start: min, length }))
      k++
    }

    if (k === 100) {
      throw `could not select random day besides eom!`
    }
    return day
  },
  randomDate: ({ leap = true, min = moment(), length = 10, eom = true, exclude = null } = {}) => {
    length = moment.duration({ years: length })
    let days = length.asDays()
    let duration = moment.duration({ days: randomInclusive(0, days) })
    let date = min.add(duration)

    if (eom) {
      return date
    }

    let k = 0
    while ((date.date() === date.daysInMonth() || date.isSame(exclude, 'day')) && k < 100) {
      duration = moment.duration({ days: randomInclusive(0, days) })
      date = min.add(duration)
      k++
    }

    if (k === 100) {
      throw `Could only find date at end of month!`
    }
    return date
  }
}

module.exports = Calendar
