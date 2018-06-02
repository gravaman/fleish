let math = require('mathjs')
let Board = require('./board')
let Cli = require('./cli')

let cli = Object.create(Cli)

let Game = {
  state: {
    boards: [],
    winner: null,
    interface: cli,
    status: 'START'
  },
  playerMove: function(input) {
    let target = this.toTarget(input)
    let board = this.hasStarted() ? this.copyPrior() : this.blankBoard()
    board.addMove(target)
    this.state.boards.push(board)

    this.statusCheck(this.aiMove)
  },
  aiMove: function() {

  },
  statusCheck: function(callback) {
     
    if (callback && !winner) {
      callback()
    }
  },
  toTarget: function(str) {
    let index = parseInt(str) - 1
    let row = Math.trunc(index / 3)
    let col = index % 3
    return [row, col]
  }
  hasStarted: function() {
    return this.state.status !== 'START'
  },
  copyPrior: function() {
    let prior = this.boards[this.boards.length]
    return new Board({ parentKey: prior.key })
  },
  blankBoard: function() {
    return new Board({ parentKey: '0'.repeat(9) })
  }
  play: function() {
    cli.start(this.playerMove)
  }
}

module.exports = Game
