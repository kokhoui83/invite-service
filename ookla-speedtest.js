/* eslint-env node, mocha */
import Schema from '../../../../../../src/lib/athena/schemas/ookla-speedtest'

describe.only('Schema - ookla-speedtest', () => {
  describe('Create table', () => {
    context('get schema', () => {
      it('should return schema', () => {
        const schema = Schema.createTable()
        console.log(schema)
      })
    })
  })
})
