const express = require('express')
let MoveExaminer = require('../modules/moveExaminer')
let Move = require('../models/move')
let Board = require('../models/board')

let router = express.Router()
const ALPHA = 0.5

function calculateWinner(key) {
  const squares = keyToSquares(key)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function keyToSquares(key) {
  return key.split('').map(move => Number(move) === 0 ? null : Number(move))
}

function keyToBoard(key, player) {
  if (!key || player === 1) {
    return null
  }
  return Board.findOrCreate({ key })
}

router.get('/:player/:key', function(req, res) {
  const { player, key } = req.params
  return MoveExaminer.findNext(player, key, move => res.send(move.key))
})
  .post('/', function(req, res) {
    const { player, priorKey, startKey, endKey } = req.body
    let move = new Move({ player, startKey, endKey })

    move.save()
      .then(move => {
        return Promise.all([
          keyToBoard(priorKey, player),
          keyToBoard(startKey, player % 2 + 1),
          keyToBoard(endKey, player)
        ])
      })
      .then(function([prior, start, current]) {
        let winner = calculateWinner(endKey)
        if (!winner && player === 1) {
          return Promise.resolve()
        }

        if (winner === 1) {
          let chg = parseFloat(start.probability) - ALPHA * parseFloat(start.probability)
          return Board.update({ _id: start._id }, { probability: chg }).exec()
        }

        if (winner === 2) {
          current.probability = 1
        }

        let chg = parseFloat(prior.probability) + ALPHA * (current.probability - parseFloat(prior.probability))
        prior.probability = chg

        return Promise.all([
          Board.update({ _id: prior._id }, { probability: prior.probability }).exec(),
          Board.update({ _id: current._id }, { probability: current.probability }).exec()
        ])
      })
      .then(_ => {
        return res.sendStatus(201)
      })
      .catch(err => {
        console.log('ERROR:', err)
        return res.sendStatus(500)
      })
    })


module.exports = router
