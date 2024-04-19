// XXX Cozy-stack can execute node commands in a nsjail, but the script to do
// that are quite complex and require to execute this file with no arguments on
// the command line except the script to execute. Here, we detect when we are
// in this case via the COZY_URL environ variable, and transform the options to
// tell to mjml to read on stdin and output on stdout. It allows this script to
// be used by the cloudery and the stack without having to do heavy
// modifications for integrating cozy-mjml in them.
try {
  if (process.env.COZY_URL) {
    process.argv.push('-i')
    process.argv.push('-s')
  }
} catch (err) {
  process.stderr.write('err: ' + err + '\n')
}

// XXX We need to do the requires in this order if we want to have the default
// components and our custom ones.
require('mjml')
const registerComponents = require('./components').register

const run = require('mjml-cli/lib/client')
registerComponents()

run()
