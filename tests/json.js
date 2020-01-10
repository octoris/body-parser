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
        ctx.response.writeHead(200, { 'Content-Type': 'application/json' })
        ctx.response.end(JSON.stringify(ctx.body))
      })
      .catch(({ err, ctx }) => {
        ctx.response.writeHead(400, { 'Content-Type': 'text/html' })
        ctx.response.end(err.message)
      })
  })
}


// test('Basic', t => {
//   request(createServer())
//     .post('/')
//     .set('Content-Type', 'application/json')
//     .send('{ "user": "frank" }')
//     .expect(200)
//     .end((err, res) => {
//       t.error(err, 'No Error')
//       t.same(res.body, { user: 'frank' })
//       t.end()
//     })
// })

// test('With Options', t => {
//   request(createServer({ strict: true }))
//     .post('/')
//     .set('Content-Type', 'application/json')
//     .send('{ "user": "frank" }')
//     .expect(200)
//     .end((err, res) => {
//       t.error(err, 'No Error')
//       t.same(res.body, { user: 'frank' })
//       t.end()
//     })
// })

test('With invalid encoding', t => {
  request(createServer())
    .post('/')
    .type('json')
    .set('content-encoding', 'invalid')
    .send('{ "user": "frank" }')
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No Error')
      t.same(res.body, { user: 'frank' })
      t.end()
    })
})

// test('With Invlaid content encoded', t => {
//   request(createServer({ strict: true }))
//     .post('/')
//     .set('Content-Type', 'application/json')
//     .send('Not JSON!')
//     .expect(400)
//     .end((err, res) => {
//       t.error(err, 'No Error')
//       t.same(res.text, 'Invalid JSON')
//       t.end()
//     })
// })

// test('Strict Mode Off', t => {
//   request(createServer({ strict: false }))
//     .get('/')
//     .set('Content-Type', 'application/json')
//     .send('{ "user": "frank" }')
//     .expect(200)
//     .end((err, res) => {
//       t.error(err, 'No Error')
//       t.same(res.body, { user: 'frank' })
//       t.end()
//     })
// })
