# body-parser

A body parser middleware for octoris

## Install

```cli
npm i @octoris/body-parser
```

## json(opts)

The json parser for handling json payloads

### Options

- `strict`: when set to true, JSON parser will only accept arrays and objects; when false will accept anything JSON.parse accepts. Defaults to true. (also strict mode will always return an object)
- `limit`: Number or string representing the request size limit. Defaults to `1mb`
- `encoding`: The content encoding type. Defaults to `utf8`

### Usage

```js
const { router, response, methods} = require('octoris')
const { json } = require('@octoris/body-parser')

function handler () {
  return new Promise(resolve => send(200, 'Okay!'))
}

const home = router.route([router.fixed('/')], [methods.GET(handler)])

router.composeRoutes({}, [home], [json()])
```

## form(opts)

Form parser for handling url-encoded form payloads

### Options

- `queryString`: An options object that is passed directly to the [qs](https://github.com/ljharb/qs) module
- `limit`: A number or string representing the request size limit. Defaults to `56kb`
- `qs`: The querystring function you'd like to use. Defaults to `qs`
- `encoding`: The content encoding type. Defaults to `utf8`

### Usage

```js
const { router, response, methods} = require('octoris')
const { form } = require('@octoris/body-parser')

function handler () {
  return new Promise(resolve => send(200, 'Okay!'))
}

const home = router.route([router.fixed('/')], [methods.GET(handler)])

router.composeRoutes({}, [home], [form()])
```
