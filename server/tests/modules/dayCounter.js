let test = require('tape')
let DayCounter = require('../modules/dayCounter')

test('hello world', function(t) {
  t.plan(1)

  t.equal(typeof Date.now, 'function')
})
