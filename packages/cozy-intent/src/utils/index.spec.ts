import { interpolate } from '.'

describe('interpolate', () => {
  it('interpolates with one argument', () => {
    const template = 'This is ${arg} argument.'

    expect(interpolate(template, { arg: 'one' })).toBe('This is one argument.')
  })

  it('interpolates with five arguments', () => {
    const template = '1 ${one} 2 ${two} 3 ${three} 4 ${four} 5 ${five}.'

    expect(
      interpolate(template, {
        one: 'one',
        two: 'two',
        three: 'three',
        four: 'four',
        five: 'five'
      })
    ).toBe('1 one 2 two 3 three 4 four 5 five.')
  })

  it('interpolates with missing argument', () => {
    const template = 'This is ${arg} ${two} argument.'

    expect(interpolate(template, {})).toBe('This is ${arg} ${two} argument.')
  })

  it('interpolates with missing params', () => {
    const template = 'This is ${arg} ${two} argument.'

    expect(
      interpolate(template, undefined as unknown as Record<string, string>)
    ).toBe('This is ${arg} ${two} argument.')
  })
})
