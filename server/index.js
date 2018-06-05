const express = require('express')

const app = express()

app.use(express.static('dist'))

app.listen(process.env.PORT, () => console.log(`doowo:P is listening on port ${ process.env.PORT }`))
