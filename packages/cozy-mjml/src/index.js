const fs = require('fs')
const path = require('path')
const mjml2html = require('mjml')
require('./components')

fs.readFile(path.normalize('./example.mjml'), 'utf8', (err, data) => {
  if (err) throw err
  const result = mjml2html(data)
  fs.writeFileSync(path.normalize('./dist/example.html'), result.html)
})
