let readline = require('readline')
let math = require('mathjs')

function createGame() {
  let game = {
    boards: [math.zeros(3,3)],
    turn: 0,
    player: 1,
    winner: null,
    finished: false,
    lastTurn: function () {
      return Math.max(this.turn - 1, 0)
    },
    checkFinished: function () {
      if (this.turn === this.boards.length) {
        this.finished = true
      }
    },
    getBoard: function () {
      return this.boards[this.turn]
    },
    getTarget: function(str) {
      let index = parseInt(str) - 1
      let row = Math.trunc(index / 3)
      let col = index % 3
      return [row, col]
    },
    isInvalidTarget: function (str) {
      let [row, col] = this.getTarget(str)
      let board = this.boards[this.lastTurn()]
      let space = board.subset(math.index(row, col))
      return space !== 0
    },
    checkTarget: function(str) {
      if (this.isInvalidTarget(str)) {
        throw `space already selected: ${ str }`
      }
    },
    addBoard: function (target) {
      let [row, col] = target
      let board = math.clone(this.boards[this.lastTurn()])
      board.subset(math.index(row, col), this.player)
      this.boards[this.turn] = board
    },
    makeMove: function (str) {
      let target = this.getTarget(str)
      this.addBoard(target)
      this.checkForWinner()
      this.checkFinished()
      this.printBoard()
      if (!this.finished) {
        this.turn++
        this.player = this.turn % 2 + 1
      }
    },
    checkForWinner: function () {
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
          this.winner = this.player
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
        this.winner = this.player
      }
    },
    isWinner: function (arr) {
      let hits = math.filter(arr, el => el === this.player)
      return hits.length === 3
    },
    printBoard: function () {
      let board = this.getBoard()
      board = board.valueOf()

      console.log('\n', '*'.repeat(5), 'BOARD', '*'.repeat(5))
      board.forEach(row => console.log(`  ${ row[0] }  |  ${ row[1] }  |  ${ row[2] }  `))
    }
  }

  return game
}

// cli
function play(game) {
  let cli = {
    rl: null,
    game: game,
    updatePrompt: function() {
      this.rl.setPrompt(`${ this.game.player }> `)
    },
    checkInput: function(str) {
      if (!this.validEntry(str)) {
        throw `invalid entry: ${ str }`
      }
      this.game.checkTarget(str)
    },
    validEntry: function(str) {
      return /[1-9]|(exit)/.test(str)
    },
    handleExit: function() {
      console.log('goodbye!')
      this.rl.close()
    },
    handleWin: function() {
      console.log('WINNER WINNER CHICKEN DINNER:', this.game.winner)
      this.handleExit()
    },
    handleDraw: function() {
      console.log('DRAW')
      this.handleExit()
    },
    handleLine: function(line) {
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

      this.game.makeMove(str)

      if (this.game.winner) {
        this.handleWin()
      }

      if (this.game.finished) {
        this.handleDraw()
      }

      this.updatePrompt(rl, game)
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
let game = createGame()
play(game)
