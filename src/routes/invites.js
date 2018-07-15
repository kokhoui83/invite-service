
module.exports = function ({ app }) {
  /**
   * @swagger
   * definition:
   *  validateInvite:
   *    type: object
   *    required:
   *    - inviteToken
   *    properties:
   *      inviteToken:
   *        type: string
   *        description: an app invite token
   *        example: d4f434
   *  generateInvite:
   *    type: object
   *    required:
   *    - userId
   *    - clientId
   *    - appKey
   *    - appUrl
   *    properties:
   *      userId:
   *        type: string
   *        description: the user id that requested the invite to be generated
   *        example: aleks@example.com
   *      clientId:
   *        type: integer
   *        description: the client id for which this invite is generated
   *        example: 50
   *      appKey:
   *        type: string
   *        description: app key used by the SDK
   *        example: 4d4f434841-373836313836303830-3430-616e64726f6964
   *      appUrl:
   *        type: string
   *        description: environment url used by the SDK
   *        example: https://test.example.com/2.1
   */

  /**
   * @swagger
   * /invite:
   *  get:
   *    tags:
   *    - invite
   *    description: test invite root path
   *    produces:
   *    - application/json
   *    responses:
   *      200:
   *        description: status
   */
  app.get('/invite', (req, res) => {
    return res.status(200).json({ status: 'OK' })
  })

  /**
   * @swagger
   * /invite/generate:
   *  post:
   *    tags:
   *    - invite
   *    description: generate an invite
   *    produces:
   *    - application/json
   *    consumes:
   *    - application/json
   *    parameters:
   *    - name: body
   *      in: body
   *      required: true
   *      schema:
   *        $ref: '#/definitions/generateInvite'
   *    responses:
   *      200:
   *        description: status
   */
  app.post('/invite/generate', (req, res) => {
    console.log(req.body)
    return res.status(200).json({ status: 'OK' })
  })

  /**
   * @swagger
   * /invite/validate:
   *  post:
   *    tags:
   *    - invite
   *    description: validate invite
   *    produces:
   *    - application/json
   *    consumes:
   *    - application/json
   *    parameters:
   *    - name: body
   *      in: body
   *      required: true
   *      schema:
   *        $ref: '#/definitions/validateInvite'
   *    responses:
   *      200:
   *        description: status
   */
  app.post('/invite/validate', (req, res) => {
    console.log(req.body)
    return res.status(200).json({ status: 'OK' })
  })
}