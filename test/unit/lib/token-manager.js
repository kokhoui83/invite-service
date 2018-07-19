const assert = require('assert')
const sinon = require('sinon')
const moment = require('moment')

const TokenManager = require('../../../src/lib/token-manager')

describe('Token Manager', () => {
  const sandbox = sinon.createSandbox()
  let manager

  before(() => {
    manager = new TokenManager()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('Instance', () => {
    context('new instance', () => {
      it('should be valid instance', () => {
        assert(manager)
      })
    })
  })

  describe('create invite', () => {
    context('create new invite', () => {
      it('should return invite record', () => {
        const data = {
          userId: 'aleks@example.com',
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        return manager.createInvite(data)
          .then(invite => {
            assert(invite)
            assert.equal(invite.token.length, 6)
          })
      })
    })
  })

  describe('validate invite', () => {
    context('check valid invite token', () => {
      it ('should return invite record', () => {
        const current = moment()
        const expected = {
          userId: 'aleks@example.com',
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1',
          token: 'a1b2c3',
          created: current.unix(),
          expired: current.add(7, 'days').unix()
        }

        manager._tokens[expected.userId] = expected

        return manager.validateInvite(expected.token)
          .then(invite => {
            assert(invite)
          })
      })
    })
  })
})
