const express = require('express')
let MoveExaminer = require('../modules/moveExaminer')
let Board = require('../models/board')
let router = express.Router()

router.get('/:key', function(req, res) {
  const AI_KEY = 2
  const key = req.params.key
  return MoveExaminer.findNext(AI_KEY, key, board => res.send(board.key))
})

module.exports = router
