const assert = require('assert')
const supertest = require('supertest')
const sinon = require('sinon')

const server = require('../../../src/server')

describe('Routes - invite', () => {
  let sandbox = sinon.createSandbox()
  let request
  let _context

  before((done) => {
    server((err, context) => {
      request = supertest(context.app)
      _context = context
      done()
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('GET /invite', () => {
    context('get all invites', () => {
      it('should return success', (done) => {
        const expected = [
          { userId: 'a@example.com', active: true },
          { userId: 'b@example.com', active: true },
          { userId: 'c@example.com', active: true }
        ]

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('getInvites')
          .withArgs(null)
          .once()
          .resolves(expected)

        request
          .get(`/invite`)
          .auth('test', 'test')
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            const invites = JSON.parse(res.text)
            assert(invites instanceof Array)
            assert.equal(invites.length, expected.length)
            mockTokenMgr.verify()

            done()
          })
      })
    })

    context('get active invites', () => {
      it('should return success', (done) => {
        const expected = [
          { userId: 'a@example.com', active: true },
          { userId: 'c@example.com', active: true }
        ]

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('getInvites')
          .withArgs(true)
          .once()
          .resolves(expected)

        request
          .get(`/invite?active=true`)
          .auth('test', 'test')
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            const invites = JSON.parse(res.text)
            assert(invites instanceof Array)
            assert.equal(invites.length, expected.length)
            mockTokenMgr.verify()

            done()
          })
      })
    })

    context('get inactive invites', () => {
      it('should return success', (done) => {
        const expected = [
          { userId: 'b@example.com', active: false }
        ]

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('getInvites')
          .withArgs(false)
          .once()
          .resolves(expected)

        request
          .get(`/invite?active=false`)
          .auth('test', 'test')
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            const invites = JSON.parse(res.text)
            assert(invites instanceof Array)
            assert.equal(invites.length, expected.length)
            mockTokenMgr.verify()

            done()
          })
      })
    })

    context('invalid auth', () => {
      it('should return forbidden', (done) => {
        request
          .get(`/invite`)
          .auth('apple', '123')
          .expect(403)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })
    })

    context('missing auth', () => {
      it('should return forbidden', (done) => {
        request
          .get(`/invite`)
          .expect(403)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })
    })

    context('wrong auth', () => {
      it('should return forbidden', (done) => {
        request
          .get(`/invite`)
          .auth('test', 'wrong')
          .expect(403)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })
    })
  })

  describe('DELETE /invite/:clientId', () => {
    context('valid clientId', () => {
      it('should revoke invite', (done) => {
        const expected = {
          userId: 'aleks@example.com',
          clientId: 10,
          active: false,
          revoke: true
        }

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('revokeInvite')
          .withArgs(expected.clientId)
          .once()
          .resolves(expected)

        request
          .delete(`/invite/${expected.clientId}`)
          .auth('test', 'test')
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('revoke'))
            assert.equal(res.body.clientId, expected.clientId)
            assert.equal(res.body.revoke, expected.revoke)
            mockTokenMgr.verify

            done()
          })
      })
    })

    context('missing clientId', () => {
      it('should return 400', (done) => {
        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('revokeInvite')
          .never()

        request
          .delete(`/invite/wrong`)
          .auth('test', 'test')
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')
            mockTokenMgr.verify()

            done()
          })
      })
    })
  })

  describe('POST /invite/generate', () => {
    context('generate invite', () => {
      it('shoudl return success', (done) => {
        const data = {
          userId: 'aleks@example.com',
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        request
          .post(`/invite/generate`)
          .send(data)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('inviteToken'))
            assert(res.body.hasOwnProperty('validTo'))

            done()
          })
      })
    })

    context('generate invite - invalid body', () => {
      it('should return error', (done) => {
        const data = {
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        request
          .post(`/invite/generate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })

      it('should return error', (done) => {
        const data = {
          userId: 'aleks@example.com',
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        request
          .post(`/invite/generate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })

      it('should return error', (done) => {
        const data = {
          userId: 'aleks@example.com',
          clientId: 50,
          appUrl: 'https://test.example.com/2.1'
        }

        request
          .post(`/invite/generate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })

      it('should return error', (done) => {
        const data = {
          userId: 'aleks@example.com',
          clientId: 50,
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964'
        }

        request
          .post(`/invite/generate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')

            done()
          })
      })
    })
  })

  describe('POST /invite/validate', () => {
    context('validate invite', () => {
      it('should return success', (done) => {
        const data = {
          inviteToken: 'd4f434'
        }

        const expected = {
          appKey: '4d4f434841-373836313836303830-3430-616e64726f6964',
          appUrl: 'https://test.example.com/2.1'
        }

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('validateInvite')
          .withArgs(data.inviteToken)
          .once()
          .resolves(expected)

        request
          .post(`/invite/validate`)
          .send(data)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('appKey'))
            assert(res.body.hasOwnProperty('appUrl'))
            assert.equal(res.body.appKey, expected.appKey)
            assert.equal(res.body.appUrl, expected.appUrl)
            mockTokenMgr.verify()
            done()
          })
      })
    })

    context('validate invite - invalid body', () => {
      it('shoudl return error', (done) => {
        const data = {
          inviteToken: 123456
        }

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('validateInvite')
          .never()

        request
          .post(`/invite/validate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')
            mockTokenMgr.verify()
            done()
          })
      })

      it('shoudl return error', (done) => {
        const data = {
          token: '123456'
        }

        const mockTokenMgr = sandbox.mock(_context.tokenManager)
        mockTokenMgr
          .expects('validateInvite')
          .never()

        request
          .post(`/invite/validate`)
          .send(data)
          .expect(400)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'FAILED')
            mockTokenMgr.verify()
            done()
          })
      })
    })
  })
})
