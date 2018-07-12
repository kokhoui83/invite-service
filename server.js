const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/ping', (req, res) => {
  res.send('pong')
})

app.listen(config.app.port, config.app.host, function () {
  console.log(`app listening on port ${config.app.host}:${config.app.port}`)
})
