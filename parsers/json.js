const raw = require('raw-body')
const inflate = require('inflation')

const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/

function json (opts) {
  return function (ctx) {
    return new Promise((resolve, reject) => {
      const len = ctx.request.headers['content-length']
      const encoding = ctx.request.headers['content-encoding'] || 'identity'

      if (len && encoding === 'identity') {
        opts.length = ~~len
      }

      const strict = opts.strict !== false

      opts.encoding = opts.encoding || 'utf8'
      opts.limit = opts.limit || '1mb'

      function parse (str) {
        if (!str) {
          return {}
        }

        if (strict && !strictJSONReg.test(str)) {
          return reject({ err: new Error('Invalid JSON'), ctx })
        }

        return JSON.parse(str)
      }

      return raw(inflate(ctx.request), opts)
        .then(str => {
          ctx.body = parse(str)
          return resolve(ctx)
        })
    })
  }
}

module.exports = json
