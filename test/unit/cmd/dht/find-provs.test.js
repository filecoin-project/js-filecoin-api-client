const test = require('ava')
const Multiaddr = require('multiaddr')
const Filecoin = require('../../../../src')
const { toAsyncIterable } = require('../../../helpers/iterable')
const Fixtures = require('./find-provs.fixtures.json')

test('should find providers', async t => {
  const fetch = () => ({
    ok: true,
    body: toAsyncIterable(Fixtures.sample0.map(p => `${JSON.stringify(p)}\n`))
  })
  const fc = Filecoin(fetch)

  let i = 0
  for await (const peer of fc.dht.findProvs('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH')) {
    if (peer.id) {
      t.is(peer.id, Fixtures.sample0[i].ID)
    }

    t.true(typeof peer.type === 'number')
    t.is(peer.type, Fixtures.sample0[i].Type)

    peer.responses.forEach((r, j) => {
      t.is(r.id, Fixtures.sample0[i].Responses[j].ID)
      r.addrs.forEach((a, k) => {
        t.notThrows(() => Multiaddr(a))
        t.is(a.toString(), Fixtures.sample0[i].Responses[j].Addrs[k])
      })
    })

    if (peer.extra) {
      t.true(typeof peer.extra === 'string')
      t.is(peer.extra, Fixtures.sample0[i].Extra)
    }

    i++
  }
})
