const fs = require('fs')
const path = require('path')

const mjml2html = require('mjml')

const registerComponents = require('../src/components').register

describe('The example', () => {
  it('works', () => {
    registerComponents()
    const filename = path.resolve(__dirname, '../example.mjml')
    const data = fs.readFileSync(filename, 'utf8')
    const html = mjml2html(data)
    expect(html).toMatchSnapshot()
  })
})
