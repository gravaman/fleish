const express = require('express')
let MoveExaminer = require('../modules/moveExaminer')
let Move = require('../models/move')
let Board = require('../models/board')

let router = express.Router()
const ALPHA = 0.5

router.get('/:player/:key', function(req, res) {
  const { player, key } = req.params
  return MoveExaminer.findNext(player, key, move => res.send(move.key))
})
  .post('/', function(req, res) {
    const { player, priorKey, currentKey } = req.body
    let move = new Move({ player, priorKey, currentKey })

    move.save()
      .then(move => {
        return Promise.all([
          Board.findOrCreate({ player, key: priorKey }),
          Board.findOrCreate({ player, key: currentKey })
        ])
      })
      .then(function([prior, current]) {
        let chg = parseFloat(prior.probability) + ALPHA * (current.probability - parseFloat(prior.probability))
        prior.probability = chg
        return prior.save()
      })
      .then(prior => {
        return res.sendStatus(201)
      })
      .catch(err => {
        return res.sendStatus(500)
      })
    })


module.exports = router
