const child_process = require('child_process')

describe('The example', () => {
  it('works', () => {
    const html = child_process.execSync('node dist/main.js -r example.mjml -s')
    expect(html).toMatchSnapshot()
  })
})
