const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('hello world!'))

app.listen(process.env.PORT, () => console.log(`doowo:P is listening on port ${ process.env.PORT }`))
