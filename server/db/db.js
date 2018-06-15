let mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  mongoose.connect('mongodb://localhost:27017/fleish')
} else {
  mongoose.connect(process.env.MONGODB_URI)
}

mongoose.connection
  .on('error', () => {})
  .once('open', () => {})

module.exports = mongoose
