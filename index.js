// let readline = require('readline')
// let math = require('mathjs')
// let TransitionExaminer = require('./modules/transitionExaminer')
let Game = require('./game')

function createGame() {
  let game = {
    boards: [math.zeros(3,3)],
    turn: 0,
    player: 1,
    aiPlayer: 2,
    winner: null,
    complete: false,
    lastTurn: function lastTurn() {
      return Math.max(this.turn - 1, 0)
    },
    lastBoard: function lastBoard() {
      return math.clone(this.boards[this.lastTurn()])
    },
    checkComplete: function checkComplete() {
      if (this.winner || this.turn === 8) {
        this.complete = true
      }
    },
    getBoard: function getBoard() {
      return this.boards[this.turn]
    },
    getTarget: function getTarget(str) {
      let index = parseInt(str) - 1
      let row = Math.trunc(index / 3)
      let col = index % 3
      return [row, col]
    },
    isInvalidTarget: function isInvalidTarget(str) {
      let [row, col] = this.getTarget(str)
      let board = this.lastBoard()
      let space = board.subset(math.index(row, col))
      return space !== 0
    },
    checkTarget: function checkTarget(str) {
      if (this.isInvalidTarget(str)) {
        throw `space already selected: ${ str }`
      }
    },
    addBoard: function addBoard(target) {
      let [row, col] = target
      let board = this.lastBoard()
      board.subset(math.index(row, col), this.player)
      this.boards[this.turn] = board
    },
    playerMove: function playerMove(str) {
      let target = this.getTarget(str)
      this.addBoard(target)
      this.checkStatus()
      this.aiMove()
    },
    aiMove: function aiMove() {
      let board = this.lastBoard()
      let parentArr = math.flatten(board).valueOf()
      let parentKey = parentArr.join('')
      TransitionExaminer.findBest(this.aiPlayer, parentKey, (err, best) => {
        if (err) {
          return console.error(err)
        }
        let arr = best.key.split('').map(letter => Number(letter))
        let updatedBoard = math.matrix([
          math.subset(arr, math.index(math.range(0,3))),
          math.subset(arr, math.index(math.range(3,6))),
          math.subset(arr, math.index(math.range(6,9)))
        ])
        this.boards[this.turn] = updatedBoard
        this.checkStatus()
      })
    },
    checkStatus: function checkStatus() {
      this.checkForWinner()
      this.checkComplete()
      this.printBoard()
      if (this.complete) {
        return
      }
      this.turn++
    },
    checkForWinner: function checkForWinner() {
      let board = this.getBoard()
      board = board.valueOf()
      for (let i = 0; i < 3; i++) {
        let row = board[i]
        let col = [
          board[0][i],
          board[1][i],
          board[2][i]
        ]
        if (this.isWinner(row) || this.isWinner(col)) {
          this.winner = this.turn % 2 + 1
          return
        }
      }

      let diagonal1 = math.diag(board)
      let diagonal2 = [
        board[0][2],
        board[1][1],
        board[2][0]
      ]

      if (this.isWinner(diagonal1) || this.isWinner(diagonal2)) {
        this.winner = this.turn % 2 + 1
      }
    },
    isWinner: function isWinner(arr) {
      let hits = math.filter(arr, el => el === (this.turn % 2 + 1))
      return hits.length === 3
    },
    printBoard: function printBoard() {
      let board = this.getBoard()
      board = board.valueOf()
      let borderSize = 15
      let text = ' BOARD '
      let buffer = Math.trunc((borderSize - text.length) / 2)

      console.log(`\n${ '*'.repeat(buffer) }${ text }${ '*'.repeat(buffer) }`)
      board.forEach(row => console.log(` ${ row[0] }  |  ${ row[1] }  |  ${ row[2] }  `))
      console.log(`${ '*'.repeat(borderSize) }`)
    }
  }

  return game
}

// cli
function play(game) {
  let cli = {
    rl: null,
    game: game,
    setPrompt: function setPrompt() {
      this.rl.setPrompt(`${ this.game.player }> `)
    },
    checkInput: function checkInput(str) {
      if (!this.validEntry(str)) {
        throw `invalid entry: ${ str }`
      }
      this.game.checkTarget(str)
    },
    validEntry: function validEntry(str) {
      return /[1-9]|(exit)/.test(str)
    },
    handleExit: function handleExit() {
      console.log('goodbye!')
      this.rl.close()
    },
    handleComplete: function handleComplete() {
      this.game.winner === null ? console.log('DRAW') : console.log('WINNER:', this.game.winner)
      this.handleExit()
    },
    handleLine: function handleLine(line) {
      let str = line.trim()

      if (str === 'exit') {
        this.handleExit()
      }

      try {
        this.checkInput(str)
      } catch (e) {
        console.log(e)
        this.rl.prompt()
        return
      }

      this.game.playerMove(str)

      if (this.game.complete) {
        this.handleComplete()
      }

      this.rl.prompt()
    }
  }

  let rl = readline.createInterface(process.stdin, process.stdout)
  rl.on('line', cli.handleLine.bind(cli))
    .on('close', () => process.exit(0))

  cli.rl = rl
  cli.rl.prompt()
}

// main execution
Game.play()
