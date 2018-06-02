let Board = require('./board')
let Cli = require('./cli')

let cli = Object.create(Cli)

let Game = {
  state: {
    boards: [],
    winner: null,
    complete: false,
    interface: cli
  },
  handleInput: function(input) {
    console.log('boom boom boom mr. brown makes thunder:', input)
  },
  play: function() {
    cli.start(this.handleInput)
  }
}

module.exports = Game
