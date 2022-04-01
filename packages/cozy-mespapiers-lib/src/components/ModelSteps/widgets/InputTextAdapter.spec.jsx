'use strict'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import InputTextAdapter from 'src/components/ModelSteps/widgets/InputTextAdapter'

jest.mock('cozy-client/dist/models/document/locales', () => ({
  getBoundT: jest.fn(() => jest.fn())
}))

const mockAttrs = ({
  type = '',
  maxLength = 0,
  minLength = 0,
  required = false,
  defaultValue = 'fakeValue'
}) => ({
  name: 'name01',
  inputLabel: 'PaperJSON.IDCard.number.inputLabel',
  defaultValue,
  required,
  minLength,
  maxLength,
  type
})

const setup = (attrs = mockAttrs({})) => {
  const value = attrs.defaultValue
  const container = render(
    <AppLike>
      <InputTextAdapter
        attrs={attrs}
        defaultValue={value}
        setValue={jest.fn()}
        setValidInput={jest.fn()}
      />
    </AppLike>
  )
  const input = container.getByDisplayValue(value)

  return {
    input,
    ...container
  }
}

describe('InputTextAdapter components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should have a value of 5 letters', () => {
    const { input } = setup(mockAttrs({ maxLength: 5 }))
    fireEvent.change(input, { target: { value: 'abcde' } })

    expect(input.value).toBe('abcde')
  })

  it('should have a maximum of 5 characters', () => {
    const { input } = setup(mockAttrs({ maxLength: 5 }))
    fireEvent.change(input, { target: { value: 'abcdefgh' } })
    expect(input.value).toBe('fakeValue')

    fireEvent.change(input, { target: { value: '123456789' } })
    expect(input.value).toBe('fakeValue')
  })

  it('should have a value of 5 digits', () => {
    const { input } = setup(mockAttrs({ type: 'number', maxLength: 5 }))
    fireEvent.change(input, { target: { value: '12345' } })

    expect(parseInt(input.value, 10)).toBe(12345)
  })
})
