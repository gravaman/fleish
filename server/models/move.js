let db = require('../db/db')

let moveSchema = db.Schema({
  player: { type: Number, required: true },
  startKey: { type: String, required: true },
  endKey: { type: String, required: true }
}, { timestamps: true })

module.exports = db.model('Move', moveSchema)
