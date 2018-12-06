/**
 * @jest-environment node
 */

import flag, { setFlag, getFlag, listFlags, resetFlags } from './flag'

it('should create a global object', () => {
  expect(global.__COZY_FLAGS__).toBeDefined()
})

describe('setFlag', () => {
  afterEach(() => {
    global.__COZY_FLAGS__ = {}
  })

  it('should set the right value to the right key', () => {
    expect(global.__COZY_FLAGS__.test).toBeUndefined()

    setFlag('test', true)
    expect(global.__COZY_FLAGS__.test).toBe(true)
  })
})

describe('getFlag', () => {
  beforeEach(() => {
    global.__COZY_FLAGS__.test = true
  })

  afterEach(() => {
    global.__COZY_FLAGS__ = {}
  })

  it('should return the right value', () => {
    expect(getFlag('test')).toBe(true)
  })

  it('should return null if the key does not exist', () => {
    expect(getFlag('not-existing')).toBeNull()
  })

  it('should set the value to null if the key does not exist', () => {
    getFlag('not-existing')

    expect(global.__COZY_FLAGS__['not-existing']).toBeNull()
  })
})

describe('flag', () => {
  afterEach(() => {
    global.__COZY_FLAGS__ = {}
  })

  it('should return the requested flag when passed a single parameter', () => {
    global.__COZY_FLAGS__.test = true

    expect(flag('test')).toBe(true)
  })

  it('should set the flag when passed two parameters', () => {
    expect(global.__COZY_FLAGS__.test).toBeUndefined()

    flag('test', true)
    expect(global.__COZY_FLAGS__.test).toBe(true)
  })
})

describe('listFlags', () => {
  afterEach(() => {
    global.__COZY_FLAGS__ = {}
  })

  it('should return all the flag keys', () => {
    const expectedFlags = ['test', 'feature', 'thing']
    expectedFlags.forEach(expectedFlag => setFlag(expectedFlag, true))

    const flags = listFlags()

    expect(flags).toEqual(expectedFlags)
  })
})

describe('resetFlags', () => {
  it('should reset all the flags', () => {
    ;['test', 'feature', 'thing'].forEach(expectedFlag =>
      setFlag(expectedFlag, true)
    )

    expect(listFlags()).toHaveLength(3)

    resetFlags()

    expect(listFlags()).toHaveLength(0)
  })
})
