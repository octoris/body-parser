const raw = require('raw-body')
const inflate = require('inflation')
const qs = require('qs')

function form (opts) {
  return function (ctx) {
    return new Promise((resolve, reject) => {
      const qsOpts = opts.queryString || {}
      const len = ctx.request.headers['content-length']
      const encoding = ctx.request.headers['content-encoding'] || 'identity'

      if (len && encoding === 'identity') {
        opts.length = ~~len
      }

      opts.encoding = opts.encoding || 'utf8'
      opts.limit = opts.limit || '56kb'
      opts.qs = opts.qs || qs

      return raw(inflate(ctx.request), opts)
      .then(str => {
          ctx.body = opts.qs.parse(str, qsOpts)
          return resolve(ctx)
        })
        .catch(reject)
    })
  }
}

module.exports = form
