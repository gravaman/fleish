let Board = require('../board')

let TransitionExaminer = {
  findNext: function(player, key, cb) {
    this.availableTransitions(player, key, function(err, available) {
      if (err) {
        console.error(err)
        return cb(err, available)
      }

      available.sort(function(a, b) {
        return a.probability - b.probability
      })
      let [best] = available.slice(-1)
      let board = new Board({ key: best.key, probability: best.probability })
      cb(board)
    })
  },
  availableTransitions: function(player, key, cb) {
    let transitions = this.buildTransitions(player, key)
    let allKeys = transitions.map(move => move.key)
    Board.find({ key: { $in: allKeys }}, function(err, boards) {
      if (err) {
        console.error(err)
        return cb(err, boards)
      }

      boards.forEach(board => {
        transitions.forEach(move => {
          if (move.key == board.key) {
            move.probability = board.probability
          }
        })
      })

      transitions.forEach(move => {
        if (move.probability == null) {
          move.probability = 0.5
        }
      })

      cb(null, transitions)
    })
  },
  buildTransitions: function(player, key) {
    let transitionKeys = []
    for (let i = 0; i < key.length; i++) {
      let value = Number(key[i])
      if (value === 0) {
        let prefix = key.slice(0, i)
        let postfix = key.slice(i+1)
        let updated = prefix.concat(player, postfix)

        transitionKeys.push({
          key: updated,
          probability: null
        })
      }
    }
    return transitionKeys
  }
}

module.exports = TransitionExaminer
