const assert = require('assert')
const supertest = require('supertest')

const server = require('../../../src/server')

describe('Routes - invite', () => {
  let request

  before((done) => {
    server((err, { app }) => {
      request = supertest(app)
      done()
    })
  })

  describe('GET /invite', () => {
    context('check invite route', () => {
      it('should return success', (done) => {
        request
          .get(`/invite`)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'OK')

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
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'OK')

            done()
          })
      })
    })
  })

  describe('POST /invite/validate', () => {
    context('validate invite', () => {
      it('shoudl return success', (done) => {
        const data = {
          inviteToken: 'd4f434'
        }

        request
          .post(`/invite/validate`)
          .send(data)
          .expect(200)
          .end((err, res) => {
            if (err) { return done(err) }
            assert(res)
            assert(res.body.hasOwnProperty('status'))
            assert.equal(res.body.status, 'OK')

            done()
          })
      })
    })
  })
})
