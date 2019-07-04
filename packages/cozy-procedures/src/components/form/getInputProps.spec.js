import getInputProps from './getInputProps'

describe('getInputProps', () => {
  it('should return the props for the Input component of type string', () => {
    const adapterProps = {
      formContext: {},
      schema: {
        type: 'string'
      },
      t: jest.fn(),
      f: jest.fn(),
      value: 'foobar'
    }
    const result = getInputProps(adapterProps)
    const expected = {
      type: 'text',
      value: 'foobar'
    }
    expect(result).toEqual(expected)
  })

  it('should return the props for the Input component of type number', () => {
    const adapterProps = {
      readonly: true,
      autofocus: false,
      formContext: {},
      schema: {
        type: 'integer',
        maximum: 100,
        minimum: 0,
        multipleOf: 10
      },
      t: jest.fn(),
      f: jest.fn(),
      value: 100
    }
    const result = getInputProps(adapterProps)
    const expected = {
      readOnly: true,
      autoFocus: false,
      type: 'number',
      step: 10,
      max: 100,
      min: 0,
      value: 100
    }
    expect(result).toEqual(expected)
  })

  it('should return the props for a SelectBox component', () => {
    const adapterProps = {
      readonly: true,
      autofocus: false,
      formContext: {},
      schema: {
        type: 'string'
      },
      t: jest.fn(),
      f: jest.fn(),
      options: {
        enumOptions: ['single', 'separated']
      },
      value: 'single'
    }
    const result = getInputProps(adapterProps, 'select')
    const expected = {
      readOnly: true,
      autoFocus: false,
      options: {
        enumOptions: ['single', 'separated']
      },
      value: 'single'
    }
    expect(result).toEqual(expected)
  })
})
