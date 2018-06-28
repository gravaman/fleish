let test = require('tape')
let moment = require('moment')
let DayCounter = require('../../modules/dayCounter')
let Calendar = require('../../modules/calendar')
let { randomInts } = require('../../modules/utilities')
let Seeder = require('../../modules/stateSeeder')

let states = Seeder.getSeed(4)

states.forEach(s => console.log(s.toString(2)))
console.log('********')
console.log('state count:', states.length)


// test('d1: not leap, d2: not leap', function(t) {
//   t.plan(3)
//   let dt1, dt2, accrued, year
//
//   // same date
//   dt1 = Calendar.randomDate({ leap: false, eom: false })
//   dt2 = moment(dt1)
//
//   accrued = DayCounter.accrued(dt1, dt2)
//   t.equal(accrued, 0, `same date accrued (accrued: ${ accrued })`)
//
//   // end of feb
//   year = Calendar.randomYear({ leap: false })
//   dt1 = moment({ year, month: 1, date: 28 })
//   dt2 = moment({ year: year + 1, month: 1, date: 28 })
//
//   accrued = DayCounter.accrued(dt1, dt2)
//   t.equal(accrued, 360, `1 year non-leap accrued (accrued: ${ accrued })`)
//
//   // eom eom
//   let [m1, m2] = randomInts({ length: 2, min: 0, max: 11 })
//   year = Calendar.randomYear({ leap: false })
//
//   dt1 = moment({ year, month: m1, date: Calendar.daysInMonth(m1) })
//   dt2 = moment({ year, month: m2, date: Calendar.daysInMonth(m2) })
//
//   accrued = DayCounter.accrued(dt1, dt2)
//   let result = (m2 - m1) * 30
//   t.equal(accrued, result, `same year EOM accrued (accrued: ${ accrued }, result: ${ result })`)
// })
//
// test('not leap', function(t) {
//   t.plan(4)
//
//   let month = Calendar.randomMonth()
//   let endM = Calendar.daysInMonth(month)
//   let year1 = Calendar.randomYear({ leap: false })
//
//   // same year, same month, dt1 dt2
//   let d1 = Calendar.randomDay({ month, leap: false, eom: false })
//   let d2 = Calendar.randomDay({ month, leap: false, min: d1, eom: false })
//   let dt1 = moment({ year: year1, month, date: d1 })
//   let dt2 = moment({ year: year1, month, date: d2 })
//
//   // same year, different month, dt1 dt2
//
//   let accrued = DayCounter.accrued(dt1, dt2)
//   let result = moment.duration(dt2.diff(dt1)).asDays()
//   t.equal(accrued, result, `same year, dt1 dt2 (accrued: ${ accrued }, result: ${ result })`)
//
//   // same year, same month, dt1:bom dt2:eom
//   dt1.date(1)
//   dt2.date(endM)
//   accrued = DayCounter.accrued(dt1, dt2)
//   result = endM - 1
//   t.equal(accrued, result, `same year, dt1:bom dt2:eom (accrued: ${ accrued }, result: ${ result })`)
//
//   // same year, different month, dt1:eom dt2:eom
//
//   // different year, same month, dt1 dt2
//   let year2 = Calendar.randomYear({ leap: false, exclude: year1 })
//   year2 > year1 ? dt2.year(year2) : dt1.year(year2)
//
//   d2 = Calendar.randomDay({ month, leap: false, eom: false })
//   d1 = Calendar.randomDay({ month, leap: false, eom: false })
//   if (year2 > year1) {
//     dt2 = moment({ year: year2, month, date: d2 })
//     dt1 = moment({ year: year1, month, date: d1 })
//   } else {
//     dt2 = moment({ year: year1, month, date: d2 })
//     dt1 = moment({ year: year2, month, date: d1 })
//   }
//
//   accrued = DayCounter.accrued(dt1, dt2)
//   result = (dt2.year() - dt1.year()) * 360 + dt2.date() - dt1.date()
//   t.equal(accrued, result, `different year, dt1 dt2 (accrued: ${ accrued }, result: ${ result })`)
//
//   // different year, different month, dt1 dt2
//   // different year, same month, dt1 dt2:eom
//   // different year, different month, dt1 dt2:eom
//
//   // different year, same month, dt1:eom dt2
//   dt1.date(endM)
//   accrued = DayCounter.accrued(dt1, dt2)
//   result = (dt2.year() - dt1.year()) * 360 + dt2.date() - dt1.date() + 1
//   t.equal(accrued, result, `different year, dt1:eom dt2 (accrued: ${ accrued }, result: ${ result })`)
//
//   // different year, different month, dt1:eom dt2
//   // different year, same month, dt1:eom dt2:eom
//   // different year, different month, dt1:eom dt2:eom
// })
//
// test('leap', function(t) {
//   t.plan(7)
//
//   // same year, same month, dt1 dt2:leap
//   // same year, different month, dt1 dt2:leap
//
//   // different year, same month, dt1 dt2:leap
//   // different year, same month, dt1:leap dt2
//   // different year, same month, both leap
//
//   // different year, different month, dt1 dt2:leap
//   // different year, different month, dt1:leap dt2
// })
