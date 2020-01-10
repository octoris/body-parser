const http = require('http')
const request = require('supertest')
const test = require('tape')
const { json } = require('../index')

function createServer (opts = {}) {
  const _parser = json(opts)

  return http.createServer(function (req, res) {
    const context = {
      request: req,
      response: res
    }
    _parser(context)
      .then(ctx => {
        console.log(ctx.body)
        ctx.response.statusCode = 200
        ctx.response.end(JSON.stringify(ctx.request.body))
      })
      .catch(err => {
        console.error(err)
      })
  })
}


test('Example', t => {
  request(createServer())
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{ "user": "frank" }')
    .expect(200, '{}', t.end)
})
