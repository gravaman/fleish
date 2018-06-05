let Cli = require('./modules/cli')
let Game = require('./modules/game')

// main execution
let cli = Object.create(Cli)
Game.play(cli)
