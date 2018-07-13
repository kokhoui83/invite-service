
module.exports = function ({ app }) {
  app.get('/invite', (req, res) => {
    return res.status(200).json({ status: 'OK' })
  })

  app.post('/invite/validate', (req, res) => {
    return res.status(200).json({ status: 'OK' })
  })

  app.post('/invite/generate', (req, res) => {
    return res.status(200).json({ status: 'OK' })
  })
}
