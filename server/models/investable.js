let db = require('../db/db')

let investableSchema = db.Schema({
  ticker: { type: String, required: true },
  maturity: { type: Date, required: true },
  rate: { type: db.Schema.Types.Decimal128, required: true },
  frequency: { type: Number, default: 2 },
  trancheSize: { type: Number },
  position: { type: db.Schema.Types.Decimal128, default: 0 }
}, { timestamps: true })

let Investable = db.model('Investable', investableSchema)
module.exports = Investable
