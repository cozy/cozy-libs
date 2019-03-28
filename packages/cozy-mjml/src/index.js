// XXX We need to do the requires in this order if we want to have the default
// components and our custom ones.
require('mjml')
require('./components')
require('mjml-cli/lib/client')()
