const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const path = require('path')
const fs = require('fs')

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/ping', (req, res) => {
  res.send('pong')
})

const routesFolder = path.resolve(__dirname, './routes')
const routesFiles = fs.readdirSync(routesFolder).filter(file => { return /.js$/.test(file) })

routesFiles.forEach(file => {
  require(path.resolve(routesFolder, file))({ app })
})

app.listen(config.app.port, config.app.host, function () {
  console.log(`app listening on port ${config.app.host}:${config.app.port}`)
})
