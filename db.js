let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/fleish')

mongoose.connection
  .on('error', () => console.error('db connection error'))
  .once('open', () => console.log('connected to fleish db server'))

module.exports = mongoose
