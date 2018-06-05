let readline = require('readline')

let Cli = {
  start: function (board, lineCallback) {
    this.rl = readline.createInterface(process.stdin, process.stdout)

    this.rl.on('line', line => this.handleLine(line, lineCallback))
      .on('close', this.handleClose)

    this.display(board)
    this.rl.setPrompt(':) ')
    this.rl.prompt()
  },
  prompt: function() {
    this.rl.prompt()
  },
  handleLine: function(line, callback) {
    line = line.trim()
    if (callback) {
      callback(line)
    }
  },
  handleClose: function() {
    process.exit(0)
  },
  display: function(board) {
    let borderSize = 15
    let text = ' BOARD '
    let buffer = Math.trunc((borderSize - text.length) / 2)
    let rows = [
      [ board[0], board[1], board[2] ],
      [ board[3], board[4], board[5] ],
      [ board[6], board[7], board[8] ]
    ]
    console.log(`\n${ '*'.repeat(buffer) }${ text }${ '*'.repeat(buffer) }`)
    rows.forEach(row => console.log(` ${ row[0] }  |  ${ row[1] }  |  ${ row[2] }  `))
    console.log(`${ '*'.repeat(borderSize) }`)
  },
  rl: null
}

module.exports = Cli
