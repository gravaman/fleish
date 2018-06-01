let Board = require('../board')

let TransitionExaminer = {
  findBest: function findBest(player, parentKey, cb) {
    this.availableTransitions(player, parentKey, function(err, available) {
      if (err) {
        console.error(err)
        return cb(err, available)
      }

      available.sort(function(a, b) {
        return a.probability - b.probability
      })
      let [best] = available.slice(-1)
      cb(null, best)
    })
  },
  availableTransitions: function availableTransitions(player, parentKey, cb) {
    let transitions = this.buildTransitions(player, parentKey)
    let allKeys = transitions.map(move => move.key)
    Board.find({ parentKey: parentKey, key: { $in: allKeys }}, function(err, boards) {
      if (err) {
        console.error(err)
        return cb(err, boards)
      }

      boards.forEach(board => {
        transitions.forEach(move => {
          if (move.parentKey == board.parentKey && move.key == board.key) {
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
  buildTransitions: function buildTransitions(player, parentKey) {
    let transitionKeys = []
    for (let i = 0; i < parentKey.length; i++) {
      let value = Number(parentKey[i])
      if (value === 0) {
        let prefix = parentKey.slice(0, i)
        let postfix = parentKey.slice(i + 1)
        let key = prefix.concat(player, postfix)

        transitionKeys.push({
          parentKey: parentKey,
          key: key,
          probability: null
        })
      }
    }
    return transitionKeys
  }
}

module.exports = TransitionExaminer
