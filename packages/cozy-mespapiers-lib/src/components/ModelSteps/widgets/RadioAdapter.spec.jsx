import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import RadioAdapter from './RadioAdapter'
import AppLike from '../../../../test/components/AppLike'

const setup = ({
  attrs = {},
  defaultValue = '',
  setValue = jest.fn()
} = {}) => {
  return render(
    <AppLike>
      <RadioAdapter
        attrs={attrs}
        defaultValue={defaultValue}
        setValue={setValue}
      />
    </AppLike>
  )
}

describe('RadioAdapter', () => {
  const options = ['cdi', 'cdd', 'alternate', 'internship', 'other']
  const optionsTranslated = ['CDI', 'CDD', 'Alternate', 'Internship', 'Other']

  it('renders all options', () => {
    const { getByText } = setup({ attrs: { name: 'contractType', options } })

    optionsTranslated.forEach(option => {
      expect(getByText(option)).toBeInTheDocument()
    })
  })

  it('renders a text field when "other" is selected', () => {
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options }
    })

    fireEvent.click(getByLabelText('other'))

    expect(getByLabelText('other')).toBeChecked()
    expect(getByLabelText('other')).toHaveAttribute('value', 'other')
    expect(getByLabelText('other')).toHaveAttribute('type', 'radio')

    expect(getByTestId('TextField-other')).toBeInTheDocument()
    expect(getByTestId('TextField-other')).toHaveAttribute('type', 'text')
    expect(getByTestId('TextField-other')).toHaveAttribute(
      'id',
      'random-uuid-for-jest'
    )
  })

  it('calls the setValue function when an option is clicked', () => {
    const setValue = jest.fn()
    const { getByLabelText } = setup({
      attrs: { name: 'contractType', options },
      setValue
    })

    fireEvent.click(getByLabelText(options[1]))

    expect(setValue).toHaveBeenCalledTimes(1)
  })

  it('calls the setValue function when the text field is changed', () => {
    const setValue = jest.fn()
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options },
      setValue
    })

    fireEvent.click(getByLabelText('other'))
    expect(setValue).toHaveBeenCalledTimes(1)

    fireEvent.change(getByTestId('TextField-other'), {
      target: { value: 'test' }
    })
    expect(setValue).toHaveBeenCalledTimes(2)
  })
})
