/* eslint-disable no-console */

/**
 * Demonstrates the bulk updating functionality.
 *
 * When the database does not exist, it is automatically
 * created.
 */

const Document = require('../src/Document')
const { Client } = require('cozy-client-js')

class Simpson extends Document {}
Simpson.doctype = 'io.cozy.simpsons'

const main = async () => {
  const { COZY_URL, COZY_TOKEN } = process.env
  if (!COZY_URL || !COZY_TOKEN) {
    console.log('Missing URL or TOKEN in env vars.')
    return
  }
  const client = new Client({
    cozyURL: COZY_URL,
    token: COZY_TOKEN
  })

  Document.registerClient(client)
  const simpsons = await Simpson.fetchAll()
  if (simpsons.length == 0) {
    simpsons.push.apply(simpsons, [
      { _id: '1', name: 'Marge' },
      { _id: '2', name: 'Bart' },
      { _id: '3', name: 'Homer' }
    ])
  }
  simpsons.forEach(x => {
    x.lastUpdate = new Date()
  })

  const resp = await Simpson.updateAll(simpsons)
  console.log(resp)
}

main().catch(e => console.error(e))
