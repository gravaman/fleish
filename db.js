let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/fleish')

mongoose.connection
  .on('error', () => {})
  .once('open', () => {})

module.exports = mongoose
