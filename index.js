let readline = require('readline')

function displayBoard() {
  console.log('\n', '*'.repeat(5), 'BOARD', '*'.repeat(5))
  console.log(`  ${ board[0] }  |  ${ board[1] }  |  ${ board[2] }  `)
  console.log('_'.repeat(17))
  console.log(`  ${ board[3] }  |  ${ board[4] }  |  ${ board[5] }  `)
  console.log('_'.repeat(17))
  console.log(`  ${ board[6] }  |  ${ board[7] }  |  ${ board[8] }  `)
}

function updateBoard(index) {
  board[index] = turn
  if (turn === 'X') {
    turn = 'O'
  } else {
    turn = 'X'
  }
}

function isInvalid(str) {
  if (/[1-9]/.test(str)) {
    let index = parseInt(str) - 1
    if (board[index] === ' ') {
      return false
    }
  }
  return true
}

let board = Array.from(' '.repeat(9))
let turn = 'X'

displayBoard()

let rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('selection> ')
rl.prompt()

rl.on('line', function(line) {
  let str = line.trim()

  if (str === 'exit') {
    console.log('goodbye!')
    return rl.close()
  }

  if (isInvalid(str)) {
    console.log('invalid entry:', str)
    return rl.prompt()
  }

  updateBoard(parseInt(str) - 1)
  displayBoard()
  rl.prompt()
}).on('close', function() {
  process.exit(0)
})
