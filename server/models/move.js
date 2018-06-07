let db = require('../db/db')

let moveSchema = db.Schema({
  player: { type: Number, required: true },
  priorKey: { type: String, required: true },
  currentKey: { type: String, required: true }
}, { timestamps: true })

module.exports = db.model('Move', moveSchema)
