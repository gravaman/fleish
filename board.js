let db = require('./db')

let schema = db.Schema({
  parentKey: { type: String, required: true },
  key: { type: String, required: true },
  probability: { type: db.Schema.Types.Decimal128, default: 0.5 }
}, { timestamps: true })

module.exports = db.model('Board', schema)
