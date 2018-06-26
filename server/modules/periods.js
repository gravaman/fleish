let moment = require('moment')

function Periods({ settlement = moment(), exit, frequency = 2 }) {
  const TARGET_DATE = exit.date()
  const MONTH_DELTA = 12 / frequency

  let dates = []
  let last = moment(exit)

  while (last > settlement) {
    dates.unshift(last)
    let m1 = (12 + last.month() - MONTH_DELTA) % 12
    let y1 = m1 < last.month() ? last.year() : last.year() - 1
    let daysInMonth = moment({ year: y1, month:m1 }).daysInMonth()

    last = moment({
      year: y1,
      month: m1,
      date: Math.min(TARGET_DATE, daysInMonth)
    })
  }
  dates.unshift(settlement)

  return {
    dates,
    get last() {
      return this.dates[this.dates.length - 1]
    },
    get first() {
      return this.dates[0]
    }
  }
}

module.exports = Periods
