let Board = require('../board')

let MoveExaminer = {
  findNext: function(player, key, cb) {
    this.availableMoves(player, key, function(err, available) {
      if (err) {
        return console.error(err)
      }

      available.sort(function(a, b) {
        return a.probability - b.probability
      })
      let [best] = available.slice(-1)

      // get or create
      Board.findOne({ key: best.key }, function(err, board) {
        if (err) {
          return console.error(err)
        }
        if (board) {
          return cb(board)
        }
        console.log('could not find!')
        board = new Board({ key: best.key, probability: best.probability })
        board.save()
        return cb(board)
      })
    })
  },
  availableMoves: function(player, key, cb) {
    let moves = this.buildMoves(player, key)
    let allKeys = moves.map(move => move.key)
    Board.find({ key: { $in: allKeys }}, function(err, boards) {
      if (err) {
        console.error(err)
        return cb(err, boards)
      }

      boards.forEach(board => {
        moves.forEach(move => {
          if (move.key == board.key) {
            move.probability = board.probability
          }
        })
      })

      moves.forEach(move => {
        if (move.probability == null) {
          move.probability = 0.5
        }
      })

      cb(null, moves)
    })
  },
  buildMoves: function(player, key) {
    let moveKeys = []
    for (let i = 0; i < key.length; i++) {
      let value = Number(key[i])
      if (value === 0) {
        let prefix = key.slice(0, i)
        let postfix = key.slice(i+1)
        let updated = prefix.concat(player, postfix)

        moveKeys.push({
          key: updated,
          probability: null
        })
      }
    }
    return moveKeys
  }
}

module.exports = MoveExaminer
