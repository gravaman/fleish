let Cli = require('./cli')
let Game = require('./game')

// main execution
let cli = Object.create(Cli)
Game.play(cli)
