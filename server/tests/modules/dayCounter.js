let test = require('tape')
let moment = require('moment')
let DayCounter = require('../modules/dayCounter')
let Calendar = require('../modules/calendar')

test('d1: not leap, d2: not leap', function(t) {
  t.plan(1)

  // d1: !eom, d2: !eom
    // d1 === d2
    let m1 = selectRandom(mos)
    let d1 = daysInMonth(m1)
    let dt1 = moment(`2021-${ m1 }-${ d1 }`)

    let m2 = m1

    // d1 !== d2

  t.equal(typeof Date.now, 'function')
})
