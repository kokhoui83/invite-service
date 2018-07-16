const assert = require('assert')

const TokenManager = require('../../../src/lib/token-manager')

describe('Token Manager', () => {
  let manager

  before(() => {
    manager = new TokenManager()
  })

  describe('Instance', () => {
    context('new instance', () => {
      it('should be valid instance', () => {
        assert(manager)
      })
    })
  })

  describe('create invite', () => {
    context('create new token', () => {
      it('should return token', () => {
        const data = {
          userId: 'aleks@example.com',
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        return manager.createInvite(data)
          .then(token => {
            assert(token)
            assert.equal(token.length, 6)
          })
      })
    })
  })
})
