let Calendar = require('./calendar')
let Calc = require('./calculator')

let Payment = {
  setState: function(update) {
    Object.assign(this.state, update)
  },
  get date() {
    return this.state.date
  },
  get coupon() {
    return this.state.coupon
  },
  get principal() {
    return this.state.principal
  },
  get amount() {
    return Calc.add(this.state.coupon, this.state.principal)
  },
  set amount(val) {
    this.amount = val
  },
  timeFromNow: function() {
    return Calendar.yearsFromToday(this.state.date)
  }
}

function PaymentFactory({ date, coupon = 0, principal = 0 }) {
  let pmt = Object.create(Payment)
  pmt.state = {
    date,
    coupon,
    principal
  }
  return pmt
}

module.exports = PaymentFactory
