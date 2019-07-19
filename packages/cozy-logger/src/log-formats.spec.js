const prodFormat = require('./prod-format')
const devFormat = require('./dev-format')
const { setNoRetry } = require('./')
const chalk = require('chalk')

describe('dev format', () => {
  it('should log correctly an error', () => {
    const err = new Error('LOGIN_FAILED')
    setNoRetry(err)
    const formatted = devFormat('critical', err)
    const lines = formatted.split('\n')
    expect(lines[0]).toEqual(expect.stringContaining('critical'))
    expect(lines[0]).toEqual(expect.stringContaining('LOGIN_FAILED'))
    expect(lines[lines.length - 1]).toEqual(
      expect.stringContaining('no_retry: ' + chalk.yellow('true'))
    )
  })
})

describe('prod format', () => {
  const expectation = {
    time: expect.any(String),
    type: 'critical',
    no_retry: true,
    message: 'LOGIN_FAILED'
  }

  it('should log correctly an error', () => {
    const err = new Error('LOGIN_FAILED')
    setNoRetry(err)
    const formatted = prodFormat('critical', err)
    expect(JSON.parse(formatted)).toMatchObject(expectation)
  })

  it('should log correctly an object', () => {
    const err = { message: 'LOGIN_FAILED' }
    setNoRetry(err)
    const formatted = prodFormat('critical', err)
    expect(JSON.parse(formatted)).toMatchObject(expectation)
  })
})
