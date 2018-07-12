const express = require('express')
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let port = process.env.PORT || 3000

app.use('/ping', (req, res) => {
  res.send('pong')
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
