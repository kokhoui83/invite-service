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
      after(() => {
        manager._tokens = {}
      })

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

  describe('get invites', () => {
    before(() => {
      const current = moment()
      manager._tokens = {
        'a@test.com': {
          userId: 'a@test.com',
          clientId: 10,
          appKey: '1111-2222-3333-0001',
          appUrl: 'https://test.example.com/2.1',
          token: 'a1b2c1',
          created: current.unix(),
          expired: current.add(7, 'days').unix(),
          active: false
        },
        'b@test.com': {
          userId: 'b@test.com',
          clientId: 11,
          appKey: '1111-2222-3333-0002',
          appUrl: 'https://test.example.com/2.1',
          token: 'a1b2c2',
          created: current.unix(),
          expired: current.add(7, 'days').unix(),
          active: true
        },
        'c@test.com': {
          userId: 'c@test.com',
          clientId: 12,
          appKey: '1111-2222-3333-0003',
          appUrl: 'https://test.example.com/2.1',
          token: 'a1b2c3',
          created: current.unix(),
          expired: current.add(7, 'days').unix(),
          active: true
        }
      }
    })

    after(() => {
      manager._tokens = {}
    })

    context('get all invites status', () => {
      it('should return all invites status', () => {
        return manager.getInvites()
          .then(invites => {
            assert(invites)
            assert.equal(invites.length, Object.keys(manager._tokens).length)
          })
      })

      it('should return all active invites', () => {
        const active = true
        return manager.getInvites(active)
          .then(invites => {
            assert(invites)
            assert.equal(invites.length, 2)
            for (const i in invites) {
              const invite = invites[i]
              assert.equal(invite.active, active)
            }
          })
      })

      it('should return all inactive invites', () => {
        const active = false
        return manager.getInvites(active)
          .then(invites => {
            assert(invites)
            assert.equal(invites.length, 1)
            for (const i in invites) {
              const invite = invites[i]
              assert.equal(invite.active, active)
            }
          })
      })
    })
  })
})
