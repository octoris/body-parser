const http = require('http')
const request = require('supertest')
const test = require('tape')
const { form } = require('../index')

function createServer (opts = {}) {
  const _parser = form(opts)

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
      .catch(err => {
        console.log(err)
        context.response.writeHead(400, { 'Content-Type': 'text/html' })
        context.response.end(err.message)
      })
  })
}

test('Basic', t => {
  request(createServer())
    .post('/')
    .type('form')
    .send({ foo: { bar: 'baz' } })
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No Error on Basic')
      t.same(res.body.foo.bar, 'baz')
      t.end()
    })
})

test('With Invalid content encoding', t => {
  request(createServer())
    .post('/')
    .type('form')
    .set('content-encoding', 'invalid')
    .send({ foo: { bar: 'baz' } })
    .expect(400)
    .end(err => {
      t.error(err, 'No unhandled error')
      t.end()
    })
})

test('With qs default settings', t => {
  const data = { level1: { level2: { level3: { level4: { level5: { level6: { level7: 'Hello' } } } } } } }

  request(createServer()) // The default depth of qs is 5
    .post('/')
    .type('form')
    .send(data)
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No error')
      t.same(res.body.level1.level2.level3.level4.level5.level6['[level7]'], 'Hello', 'Doesn\'t parse past default depth')
      t.end()
    })
})

test('With qs with settings', t => {
  const data = { level1: { level2: { level3: { level4: { level5: { level6: { level7: 'Hello' } } } } } } }

  request(createServer({ queryString: { depth: 10 } }))
    .post('/')
    .type('form')
    .send(data)
    .expect(200)
    .end((err, res) => {
      t.error(err, 'No error')
      t.same(res.body.level1.level2.level3.level4.level5.level6.level7, 'Hello', 'Parsed whole object')
      t.end()
    })
})
