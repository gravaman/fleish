let db = require('./db')

let schema = db.Schema({
  key: { type: String, required: true },
  probability: { type: db.Schema.Types.Decimal128, default: 0.5 }
})

module.exports = db.model('Board', schema)
