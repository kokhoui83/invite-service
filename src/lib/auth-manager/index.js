const auth = require('basic-auth')
const config = require('config')

module.exports = function (req, res, next) {
  const user = auth(req)
  const users = config.users

  if (user === null || user === undefined) {
    return res.status(403).json({ status: 'FAILED', error: 'invalid user!'})
  }

  if (!users.hasOwnProperty(user.name)) {
    return res.status(403).json({ status: 'FAILED', error: 'invalid user!'})
  }

  if (users[user.name] !== user.pass) {
    return res.status(403).json({ status: 'FAILED', error: 'invalid user!'})
  }

  next()
}
