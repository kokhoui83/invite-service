const moment = require('moment')

module.exports = class TokenManager {
  /**
   * Constructor
   */
  constructor () {
    this._tokens = {}
  }

  /**
   * Create invite
   *
   * @param {object} info
   * @param {string} info.user
   * @param {number} info.clientId
   * @param {string} info.appKey
   * @param {string} info.appUrl
   *
   * @return {Promise.<string>}
   */
  createInvite (info) {
    return this._hasExisting(info)
      .then(data => {
        return data ? data : this._createToken(info)
      })
  }

  /**
   * Check if has existing invite
   *
   * @param {object} info
   * @param {string} info.user
   * @param {number} info.clientId
   * @param {string} info.appKey
   * @param {string} info.appUrl
   *
   * @return {Promise.<object>} - data
   */
  _hasExisting (info) {
    const exist = this._tokens.hasOwnProperty(info.userId)
    const data = exist ? this._tokens[info.userId] : null
    return Promise.resolve(data)
  }

  /**
   * Create new token
   *
   * @param {object} info
   * @param {string} info.user
   * @param {number} info.clientId
   * @param {string} info.appKey
   * @param {string} info.appUrl
   *
   * @return {Promise.<string>} - token
   */
  _createToken (info) {
    const current = moment()
    const token = this._generateRandomToken()

    let data = Object.assign({}, info)
    data.token = token
    data.created = current.unix()
    data.expired = current.add(7, 'days').unix()

    return this._storeInviteToken(data)
  }

  /**
   * Generate random token
   *
   * @return {string}
   */
  _generateRandomToken () {
    return Math.random().toString(16).substr(2, 6)
  }

  /**
   * Store invite token
   *
   * @param {object} data
   * @param {string} data.user
   * @param {number} data.clientId
   * @param {string} data.appKey
   * @param {string} data.appUrl
   *
   * @return {Promise.<object>} - data
   */
  _storeInviteToken (data) {
    return this._storeDatabase(data)
      .then(() => this._storeInMemory(data))
  }

  /**
   * Store data to database
   *
   * @param {object} data
   * @param {string} data.user
   * @param {number} data.clientId
   * @param {string} data.appKey
   * @param {string} data.appUrl
   *
   * @return {Promise.<object>} - data
   */
  _storeDatabase (data) {
    return Promise.resolve(data)
  }

  /**
   * Store data in-memory
   *
   * @param {object} data
   * @param {string} data.user
   * @param {number} data.clientId
   * @param {string} data.appKey
   * @param {string} data.appUrl
   *
   * @return {Promise.<object>} - data
   */
  _storeInMemory (data) {
    this._tokens[data.userId] = data

    return Promise.resolve(data)
  }
}
