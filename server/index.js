const express = require('express')
const bodyParser = require('body-parser')
let MoveController = require('./controllers/moveController')

const app = express()


app.use(express.static('dist'))
  .use(bodyParser.json())
  .use('/move', MoveController)

app.listen(process.env.PORT, () => console.log(`doowo:P is listening on port ${ process.env.PORT }`))
