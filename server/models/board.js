let db = require('../db/db')

let boardSchema = db.Schema({
  player: { type: Number, required: true },
  key: { type: String, required: true },
  probability: { type: db.Schema.Types.Decimal128, default: 0.5 }
}, { timestamps: true })

boardSchema.statics.findOrCreate = function(props) {
  let { player, key } = props
  return new Promise(function(resolve, reject) {
    Board.findOne({ player, key }, function(err, res) {
      if (err) {
        return reject(err)
      }

      if (res) {
        return resolve(res)
      }

      Board.create({ player, key })
        .then(board => resolve(board))
    })
  })
}

let Board = db.model('Board', boardSchema)

module.exports = Board
