// Loads the MJML custom components, by side effect
require('../src/components')

const fs = require('fs')
const path = require('path')
const mjml2html = require('mjml')

describe('The example', () => {
  it('works', () => {
    const filename = path.resolve(__dirname, '../example.mjml')
    const data = fs.readFileSync(filename, 'utf8')
    const html = mjml2html(data)
    expect(html).toMatchSnapshot()
  })
})
