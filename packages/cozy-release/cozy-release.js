#!/usr/bin/env node

const execSh = require('exec-sh')

const scriptPath = require.resolve('./scripts/cozy-release.sh')
const cliArgs = process.argv.slice(2)

execSh(`/bin/bash ${scriptPath} ${cliArgs.join(' ')}`, (err, stderr) => {
  if (err) {
    if (stderr) {
      // eslint-disable-next-line no-console
      console.error(stderr)
    }
    throw new Error(`Exit code: ${err.code}`)
  }
})
