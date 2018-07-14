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
        request
          .post(`/invite/generate`)
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
        request
          .post(`/invite/validate`)
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
