const raw = require('raw-body')
const inflate = require('inflation')

function text (opts) {
  return function (ctx) {
    return new Promise((resolve, reject) => {
      const len = ctx.request.headers['content-length']
      const encoding = ctx.request.headers['content-encoding'] || 'identity'

      if (len && encoding === 'identity') {
        opts.length = ~~len
      }

      opts.encoding = opts.encoding === undefined ? 'utf8' : opts.encoding
      opts.limit = opts.limit || '1mb'

      return raw(inflate(ctx.req), opts)
        .then(str => {
          ctx.body = str

          return resolve(ctx)
        })
    })
  }
}

module.exports = text
