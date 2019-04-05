const toUri = require('multiaddr-to-uri')
const { ok } = require('../../lib/fetch')

module.exports = (fetch, config) => {
  return async options => {
    options = options || {}
    const url = `${toUri(config.apiAddr)}/api/mining/stop`
    const res = await ok(fetch(url, { signal: options.signal }))
    return res.json()
  }
}
