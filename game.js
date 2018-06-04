let math = require('mathjs')
let Board = require('./board')
let Cli = require('./cli')
let TransitionExaminer = require('./modules/transitionExaminer')

let cli = Object.create(Cli)
const PLAYER_KEY = 1
const AI_KEY = 2
const ALPHA = 0.1

let Game = {
  state: {
    boards: [new Board({ key: '0'.repeat(9) })],
    winner: null
  },
  playerMove: function(input) {
    let target = this.toTarget(input)
    this.nextBoard(PLAYER_KEY, target, board => {
      let pending = this.copyState()
      pending.boards.push(board)
      this.updateProbabilities(pending.boards)
      pending.winner = this.winnerCheck(PLAYER_KEY, pending.boards[pending.boards.length - 1])

      this.state = pending

      let status = this.statusCheck()
      if (status === 'WIN' || status === 'DRAW') {
        this.saveBoard(cli.handleClose)
      } else {
        this.aiMove()
      }
    })
  },
  aiMove: function() {
    let lastBoard = this.state.boards[this.state.boards.length - 1]
    TransitionExaminer.findNext(AI_KEY, lastBoard.key, board => {
      let pending = this.copyState()
      pending.boards.push(board)
      this.updateProbabilities(pending.boards)
      pending.winner = this.winnerCheck(AI_KEY, pending.boards[pending.boards.length - 1])

      this.state = pending
      let status = this.statusCheck()
      if (status === 'WIN' || status === 'DRAW') {
        this.saveBoard(cli.handleClose)
      } else {
        this.promptOpponent()
      }
    })
  },
  saveBoard: function(callback) {
    let board
    console.log('WINNER WINNER CHICKEN DINNER:', this.state.winner)
    if (this.state.winner === AI_KEY) {
      board = this.state.boards[this.state.boards.length - 1]
      board.probability = 1
    } else {
      board = this.state.boards[this.state.boards.length - 2]
      board.probability = 0
    }

    Board.findOne({ key: board.key }, function(err, res) {
      if (err) {
        return console.error(err)
      }

      if (res) {
        res.update({ probability: board.probability }, () => {
          return callback()
        })
      } else {
        board.save().then(board => {
          return callback()
        })
      }
    })
  },
  copyState: function() {
    let boards = this.state.boards.map(board => {
      return new Board({ key: board.key, probability: board.probability })
    })

    return ({
      boards: boards,
      winner: this.state.winner,
      status: this.state.status
    })
  },
  updateProbabilities: function(boards) {
    let i = boards.length - 1
    let last = boards[i]
    let prior = boards[i - 1]
    prior.probability = prior.probability + ALPHA * (last.probability - prior.probability)

    Board.findOne({ key: prior.key }, function(err, board) {
      if (err) {
        return console.error(err)
      }

      if (board) {
        board.update({ probability: prior.probability }, () => {
          return console.log('updated!!!!')
        })
      } else {
        prior.save().then(board => {
          return
        })
      }
    })
  },
  winnerCheck: function(player, board) {
    board = board.key.split('')
    let winners = [
      [ board[0], board[1], board[2] ],
      [ board[3], board[4], board[5] ],
      [ board[6], board[7], board[8] ],
      [ board[0], board[3], board[6] ],
      [ board[1], board[4], board[7] ],
      [ board[2], board[5], board[8] ],
      [ board[0], board[4], board[8] ],
      [ board[2], board[4], board[6] ]
    ]

    for (let i = 0; i < winners.length; i++) {
      if (this.isWinner(player, winners[i])) {
        return player
      }
    }

    return null
  },
  isWinner: function (player, arr) {
    let hits = arr.filter(el => el == player)
    return hits.length === 3
  },
  promptOpponent: function() {
    cli.prompt()
  },
  statusCheck: function(callback) {
    cli.display(this.currentKey())
    if (this.state.winner) {
      return 'WIN'
    }
    if (this.state.boards.length === '10') {
      return 'DRAW'
    }
    return null
  },
  toTarget: function(str) {
    let index = parseInt(str) - 1
    let row = Math.trunc(index / 3)
    let col = index % 3
    return [row, col]
  },
  nextBoard: function(player, target, callback) {
    let current = this.currentKey()
    let next = this.nextKey(player, target)
    Board.find({ key: next }, (err, board) => {
      if (err) {
        return console.error(err)
      }
      if (board.length) {
        callback(board[0])
      } else {
        callback(new Board({ key: next }))
      }
    })
  },
  currentKey: function() {
    let board = this.state.boards[this.state.boards.length - 1]
    return board.key
  },
  nextKey(player, target) {
    // player 1: [2,3] => "000001000"
    let [row, col] = target
    let position = row * 3 + col
    let currentKey = this.currentKey()
    return currentKey.slice(0, position) + player.toString() + currentKey.slice(position + 1)
  },
  play: function() {
    cli.start(this.playerMove.bind(this))
  }
}

module.exports = Game
