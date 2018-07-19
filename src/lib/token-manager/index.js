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
   * @return {Promise.<object>}
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
   * @return {Promise.<object>} - token
   */
  _createToken (info) {
    const current = moment()
    const token = this._generateRandomToken()

    let data = Object.assign({}, info)
    data.token = token
    data.created = current.unix()
    data.expired = current.add(7, 'days').unix()
    data.active = false

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
   * @param {timestamp} data.created
   * @param {timestamp} data.expired
   * @param {boolean} data.active
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
   * @param {timestamp} data.created
   * @param {timestamp} data.expired
   * @param {boolean} data.active
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
   * @param {timestamp} data.created
   * @param {timestamp} data.expired
   * @param {boolean} data.active
   *
   * @return {Promise.<object>} - data
   */
  _storeInMemory (data) {
    this._tokens[data.userId] = data

    return Promise.resolve(data)
  }

  /**
   * Validate invite token
   *
   * @param {string} token
   *
   * @return {Promise.<object>} invite
   */
  validateInvite (token) {
    return this._retrieveInvite(token)
      .then(invite => {
        const isValid = this._isValid(invite)

        return isValid ? invite : null
      })
      .then(invite => {
        if (!invite) {
          return null
        }

        invite.active = true
        return this._updateInvite(invite)
      })
  }

  /**
   * Retrive invite from store
   *
   * @param {string} token
   *
   * @return {Promise.<object>} invite
   */
  _retrieveInvite (token) {
    return this._checkInMemory(token)
  }

  /**
   * Check if invite is valid
   *
   * @param {object} invite
   * @param {string} invite.user
   * @param {number} invite.clientId
   * @param {string} invite.appKey
   * @param {string} invite.token
   * @param {timestamp} invite.created
   * @param {timestamp} invite.expired
   * @param {boolean} invite.active
   *
   * @return {boolean} result
   */
  _isValid (invite) {
    if (!invite || !invite.expired) {
      return false
    }

    const current = moment()
    const expiry = moment.unix(invite.expired)

    return current.isBefore(expiry)
  }

  /**
   * Check if token store in memory
   *
   * @param {string} token
   *
   * @return {Promise.<object>} invite
   */
  _checkInMemory (token) {
    if (!this._tokens) {
      return Promise.reject(new Error('In memory corrupted'))
    }

    let invite

    for (const key in this._tokens) {
      const record = this._tokens[key]

      if (record.token === token) {
        invite = record
        break
      }
    }

    return Promise.resolve(invite)
  }

  /**
   * Update invite
   *
   * @param {object} invite
   * @param {string} invite.user
   * @param {number} invite.clientId
   * @param {string} invite.appKey
   * @param {string} invite.token
   * @param {timestamp} invite.created
   * @param {timestamp} invite.expired
   * @param {boolean} invite.active
   *
   * @return {Promise.<object>} invite
   */
  _updateInvite (invite) {
    return this._updateInDatabase(invite)
      .then(invite => this._updateInMemory(invite))
  }

  /**
   * Update invite in database
   *
   * @param {object} invite
   * @param {string} invite.user
   * @param {number} invite.clientId
   * @param {string} invite.appKey
   * @param {string} invite.token
   * @param {timestamp} invite.created
   * @param {timestamp} invite.expired
   * @param {boolean} invite.active
   *
   * @return {Promise.<object>} invite
   */
   _updateInDatabase (invite) {
     return Promise.resolve(invite)
   }

   /**
    * Update invite in memory
    *
    * @param {object} invite
    * @param {string} invite.user
    * @param {number} invite.clientId
    * @param {string} invite.appKey
    * @param {string} invite.token
    * @param {timestamp} invite.created
    * @param {timestamp} invite.expired
    * @param {boolean} invite.active
    *
    * @return {Promise.<object>} invite
    */
    _updateInMemory (invite) {
      if (!this._tokens) {
        return Promise.reject(new Error('In memory corrupted'))
      }

      this._tokens[invite.userId] = invite

      return Promise.resolve(invite)
    }

    /**
     * Get invites list
     *
     * @param {void|boolean} active
     *
     * @return {Promise.<array>}
     */
    getInvites (active) {
      if (!this._tokens) {
        return Promise.reject(new Error('In memory corrupted'))
      }

      let invites = []

      if (active === null || active === undefined) {
        for (const key in this._tokens) {
          const record = this._tokens[key]
          invites.push({ userId: record.userId, active: record.active })
        }
      } else {
        for (const key in this._tokens) {
          const record = this._tokens[key]

          if (record.active === active) {
            invites.push({ userId: record.userId, active: record.active })
          }
        }
      }

      return Promise.resolve(invites)
    }
}
