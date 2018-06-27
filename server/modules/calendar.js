let moment = require('moment')
let { Range, selectRandom, randomInclusive } = require('./utilities')

const MONTHS = {
  ALL: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  FEB: 2,
  EX_FEB: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  DAYS_31: [1, 3, 5, 7, 8, 10, 12],
  DAYS_30: [4, 6, 9, 11]
}

let DateHelper = {
  has31: (month) => MONTHS.DAYS_31.includes(month),
  has30: (month) => MONTHS.DAYS_30.includes(month),
  isLeap: (year) => moment([year]).isLeapYear(),
  notLeap: (year) => !DateHelper.isLeap(year),
  daysInMonth: (month, leap = false) => {
    if (DateHelper.has31(month)) {
      return 31
    }
    if (DateHelper.has30(month)) {
      return 30
    }
    return leap ? 29 : 28
  },
  mToString: (m) => ('0' + m).slice(-2),
  randomYear: ({ min = moment().year(), length = 10, leap = true } = {}) => {
    let years = Range(min, length)
    if (!leap) {
      years = years.filter(year => DateHelper.notLeap(year))
    }
    return selectRandom(years)
  },
  randomMonth: ({ min = 1, length = 12, leap = true } = {}) => {
    let mos = Range(min, length)
    if (!leap) {
      mos = mos.filter(month => month !== 2)
    }
    return selectRandom(mos)
  },
  randomDay: (month = 1, leap = true, { min = 1, length = DateHelper.daysInMonth(month, leap) } = {}) => {
    return selectRandom(Range(min, length))
  },
  randomDate: (leap = true, { min = moment(), length = 10 } = {}) => {
    length = moment.duration({ years: length })
    let days = length.asDays()
    let duration = moment.duration({ days: randomInclusive(0, days) })
    return min.add(duration)
  }
}

module.exports = DateHelper
