let db = require('../db/db')

let priceSchema = db.Schema({
  ticker: { type: String, required: true },
  value: { type: db.Schema.Types.Decimal128, required, true },
  source: { type: String, required: true }
}, { timestamps: true })

let Price = db.model('Price', priceSchema)
module.exports = Price
