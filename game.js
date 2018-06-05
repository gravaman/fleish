let Board = require('./board')
let MoveExaminer = require('./modules/moveExaminer')

const PLAYER_KEY = 1
const AI_KEY = 2
const ALPHA = 0.5

let Game = {
  state: {
    boards: [new Board({ key: '0'.repeat(9) })],
    winner: null,
    turn: 0,
    cli: null
  },
  setState: function(data) {
    this.state = Object.assign(this.state, data)
  },
  playerMove: function(input) {
    let target = this.toTarget(input)
    this.nextBoard(PLAYER_KEY, target, board => this.move(PLAYER_KEY, board))
  },
  aiMove: function() {
    let lastBoard = this.state.boards[this.state.boards.length - 1]
    MoveExaminer.findNext(AI_KEY, lastBoard.key, board => this.move(AI_KEY, board))
  },
  move: function(player, board) {
    let pending = this.copyState()
    pending.boards.push(board)
    pending.winner = this.winnerCheck(player, pending.boards[pending.boards.length - 1])
    pending.turn++
    this.setState(pending)

    this.updateProbabilities(pending.boards, () => {
      if (this.state.winner) {
        this.state.cli.display(board.key)
        console.log('winner:', this.state.winner)
        return this.state.cli.handleClose()
      }

      if (pending.turn === 9) {
        this.state.cli.display(board.key)
        console.log('draw')
        return this.state.cli.handleClose()
      }

      if (player === PLAYER_KEY) {
        return this.aiMove()
      }

      this.state.cli.display(board.key)
      return this.promptOpponent()
    })
  },
  copyState: function() {
    let boards = this.state.boards.map(board => new Board({ key: board.key, probability: board.probability }))

    return ({
      boards: boards,
      winner: this.state.winner,
      turn: this.state.turn
    })
  },
  updateProbabilities: function(boards, callback) {
    let i = boards.length - 1
    let last = boards[i]
    let prior = boards[i - 2]
    let probability

    if (this.hasWinner()) {
      if (this.state.winner === AI_KEY) {
        probability = 1.0
      }

      if (this.state.winner === PLAYER_KEY) {
        prior = boards[i - 1]
        probability = 0.0
      }
    } else {
      if (this.isPlayerTurn()) {
        return callback()
      }

      if (this.isAiTurn()) {
        probability = last.probability
      }
    }

    if (prior) {
      let chg = parseFloat(prior.probability) + ALPHA * (probability - parseFloat(prior.probability))
      prior.probability = chg
      return this.updateOrSave(prior, callback)
    }
    return callback()
  },
  hasWinner: function() {
    return this.state.winner === AI_KEY || this.state.winner === PLAYER_KEY
  },
  isPlayerTurn: function() {
    return this.state.boards.length % 2 === 0
  },
  isAiTurn: function() {
    return !this.isPlayerTurn()
  },
  updateOrSave: function(board, callback) {
    Board.findOne({ key: board.key }, function(err, res) {
      if (err) {
        return console.error(err)
      }

      if (res) {
        res.update({ probability: board.probability }, () => {
          // console.log(`board_id: ${ res._id } probability updated to ${ board.probability.toString() }`)
          if (callback) {
            return callback()
          }
        })
      } else {
        board.save()
          .then(res => {
            console.log(`saved board: ${ res }`)
            if (callback) {
              return callback()
            }
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
    this.state.cli.prompt()
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
  nextKey: function(player, target) {
    // player 1: [2,3] => "000001000"
    let [row, col] = target
    let position = row * 3 + col
    let currentKey = this.currentKey()
    return currentKey.slice(0, position) + player.toString() + currentKey.slice(position + 1)
  },
  play: function(cli) {
    this.setState({ cli: cli })
    let startBoard = this.state.boards[0]
    cli.start(startBoard.key, this.playerMove.bind(this))
  }
}

module.exports = Game
