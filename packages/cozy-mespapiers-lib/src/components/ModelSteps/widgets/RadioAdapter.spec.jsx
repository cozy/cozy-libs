/* eslint-disable jest/no-focused-tests */
import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import RadioAdapter from './RadioAdapter'
import AppLike from '../../../../test/components/AppLike'

const setup = ({
  attrs = {},
  defaultValue = '',
  setValue = jest.fn(),
  setValidInput = jest.fn()
} = {}) => {
  return render(
    <AppLike>
      <RadioAdapter
        attrs={attrs}
        defaultValue={defaultValue}
        setValidInput={setValidInput}
        setValue={setValue}
        idx={0}
      />
    </AppLike>
  )
}

describe('RadioAdapter', () => {
  const makeOptions = ({ required } = {}) => [
    [
      { value: 'cdi', label: 'attributes.contractType.cdi' },
      { value: 'cdd', label: 'attributes.contractType.cdd' },
      { value: 'alternate', label: 'attributes.contractType.alternate' },
      {
        value: 'other',
        label: 'attributes.contractType.other',
        textFieldAttrs: { label: 'textFieldAttrs.label', required }
      }
    ],
    [{ value: 'internship', label: 'attributes.contractType.internship' }]
  ]
  const optionsTranslated = ['CDI', 'CDD', 'Alternate', 'Internship', 'Other']

  it('renders all options', () => {
    const { getByText } = setup({
      attrs: { name: 'contractType', options: makeOptions() }
    })

    optionsTranslated.forEach(option => {
      expect(getByText(option)).toBeInTheDocument()
    })
  })

  it('renders a text field when "Other" is selected', () => {
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options: makeOptions() }
    })

    fireEvent.click(getByLabelText('Other'))

    expect(getByLabelText('Other')).toBeChecked()
    expect(getByLabelText('Other')).toHaveAttribute('value', 'other')
    expect(getByLabelText('Other')).toHaveAttribute('type', 'radio')

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
      attrs: { name: 'contractType', options: makeOptions() },
      setValue
    })

    fireEvent.click(getByLabelText(optionsTranslated[1]))

    expect(setValue).toHaveBeenCalled()
  })

  it('calls the setValue function when the text field is changed', () => {
    const setValue = jest.fn()
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options: makeOptions() },
      setValue
    })

    fireEvent.click(getByLabelText('Other'))
    expect(setValue).toHaveBeenCalled()

    fireEvent.change(getByTestId('TextField-other'), {
      target: { value: 'test' }
    })
    expect(setValue).toHaveBeenCalled()
  })

  it('calls the setValue function with the right value when the text field is changed', () => {
    let nextState
    const setValue = jest.fn().mockImplementation(callback => {
      nextState = callback({})
    })
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options: makeOptions() },
      setValue
    })

    fireEvent.click(getByLabelText('Other'))
    expect(setValue).toHaveBeenCalled()
    expect(nextState).toEqual({ contractType: 'other' })

    fireEvent.change(getByTestId('TextField-other'), {
      target: { value: 'test' }
    })
    expect(setValue).toHaveBeenCalled()
    expect(nextState).toEqual({ contractType: 'test' })

    fireEvent.click(getByLabelText('CDD'))
    expect(setValue).toHaveBeenCalled()
    expect(nextState).toEqual({ contractType: 'cdd' })
  })

  it('calls the setValidInput function with the right value when "required" is not defined in the attributes of "textFieldAttrs" in the options', () => {
    let nextState
    const setValidInput = jest.fn().mockImplementation(callback => {
      nextState = callback({})
    })
    const { getByLabelText, getByTestId } = setup({
      attrs: {
        name: 'contractType',
        options: makeOptions({ required: false })
      },
      setValidInput
    })
    expect(nextState).toEqual({ 0: true })

    fireEvent.click(getByLabelText('Other'))
    expect(nextState).toEqual({ 0: true })

    fireEvent.change(getByTestId('TextField-other'), {
      target: { value: 'test' }
    })
    expect(nextState).toEqual({ 0: true })
  })

  it('calls the setValidInput function with the right value when "required" is defined in the attributes of "textFieldAttrs" in the options', () => {
    let nextState
    const setValidInput = jest.fn().mockImplementation(callback => {
      nextState = callback({})
    })
    const { getByLabelText, getByTestId } = setup({
      attrs: { name: 'contractType', options: makeOptions({ required: true }) },
      setValidInput
    })
    expect(nextState).toEqual({ 0: true })

    fireEvent.click(getByLabelText('Other'))
    expect(nextState).toEqual({ 0: false })

    fireEvent.change(getByTestId('TextField-other'), {
      target: { value: 'test' }
    })
    expect(nextState).toEqual({ 0: true })
  })
})
