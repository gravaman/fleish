let readline = require('readline')

let Cli = {
  start: function (lineCallback) {
    this.rl = readline.createInterface(process.stdin, process.stdout)

    this.rl.on('line', line => this.handleLine(line, lineCallback))
      .on('close', this.handleClose)

    this.rl.setPrompt(':) ')
    this.rl.prompt()
  },
  handleLine: function(line, callback) {
    line = line.trim()
    if (callback) {
      callback(line)
    }
    this.rl.prompt()
  },
  handleClose: function() {
    console.log('program shutting down...\n')
    process.exit(0)
  },
  rl: null
}

module.exports = Cli
