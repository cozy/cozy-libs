import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import ShareAutosuggest from './ShareAutosuggest'
describe('ShareAutosuggest', () => {
  it('tests if ShareAutosuggest call onFocus and onPick', () => {
    const onPick = jest.fn()
    const onFocus = jest.fn()
    const onRemove = jest.fn()
    const { getByPlaceholderText } = render(
      <ShareAutosuggest
        contactsAndGroups={[]}
        placeholder={'myPlaceHolder'}
        onPick={onPick}
        onFocus={onFocus}
        recipients={[]}
        onRemove={onRemove}
      />
    )
    const inputNode = getByPlaceholderText('myPlaceHolder')
    inputNode.focus()
    expect(onFocus).toHaveBeenCalled()
    //It should not call onPick if the value is not an email
    fireEvent.change(inputNode, { target: { value: 'quentin@qq' } })
    fireEvent.keyPress(inputNode, { key: 'Enter', keyCode: 13, charCode: 13 })
    expect(onPick).not.toHaveBeenCalled()
    fireEvent.keyPress(inputNode, { key: 'Space', keyCode: 32, charCode: 32 })
    expect(onPick).not.toHaveBeenCalled()

    fireEvent.change(inputNode, { target: { value: 'quentin@cozycloud.cc' } })
    fireEvent.keyPress(inputNode, { key: 'Enter', keyCode: 13, charCode: 13 })
    expect(onPick).toHaveBeenCalledWith({ email: 'quentin@cozycloud.cc' })

    fireEvent.change(inputNode, {
      target: { value: 'quentin.valmori@cozycloud.cc' }
    })
    fireEvent.keyPress(inputNode, { key: 'Space', keyCode: 32, charCode: 32 })
    expect(onPick).toHaveBeenCalledWith({
      email: 'quentin.valmori@cozycloud.cc'
    })
  })
})
