let moment = require('moment')

let Schedule = {
  setState: function(update) {
    Object.assign(this.state, update)
  },
  build: function() {
    let { targetDate, settlement, exit, monthDelta } = this.state

    let last = moment(exit)
    let dates = []

    while (last > settlement) {
      dates.unshift(last)
      last = this.prior(last)
    }
    dates.unshift(settlement)
    this.setState({ dates })
  },
  prior: function(dt2) {
    let { targetDate, monthDelta, issuance } = this.state
    let m1 = (12 + dt2.month() - monthDelta) % 12
    let y1 = m1 < dt2.month() ? dt2.year() : dt2.year() - 1
    let daysInMonth = moment({ year: y1, month:m1 }).daysInMonth()

    let dt = moment({
      year: y1,
      month: m1,
      date: Math.min(targetDate, daysInMonth)
    })
    return issuance && dt.isBefore(issuance) ? issuance : dt
  },
  get first() {
    let { dates } = this.state
    return dates[0]
  },
  get last() {
    let { dates } = this.state
    return dates[dates.length - 1]
  }
}

function Periods({ settlement = moment(), exit, issuance = null, frequency = 2 }) {
  let schedule = Object.create(Schedule)
  schedule.state = {
    settlement,
    exit,
    issuance,
    targetDate: exit.date(),
    monthDelta: 12 / frequency,
    dates: []
  }
  schedule.build()
  return schedule
}

module.exports = Periods
