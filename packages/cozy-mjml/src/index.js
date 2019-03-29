// XXX We need to do the requires in this order if we want to have the default
// components and our custom ones.
require('mjml')
const registerComponents = require('./components').register
const run = require('mjml-cli/lib/client')

registerComponents()
run()
