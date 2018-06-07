const express = require('express')
const app = express()

let BoardController = require('./controllers/boardController')

app.use(express.static('dist'))
app.use('/move', BoardController)

app.listen(process.env.PORT, () => console.log(`doowo:P is listening on port ${ process.env.PORT }`))
