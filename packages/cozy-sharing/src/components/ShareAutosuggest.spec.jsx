import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'

import ShareAutosuggest from './ShareAutosuggest'
import AppLike from '../../test/AppLike'

jest.mock('cozy-ui/transpiled/react/Spinner', () => ({
  Spinner: () => <div>loading</div>
}))

describe('ShareAutosuggest', () => {
  const setup = ({ onPick, onRemove, loading = false }) => {
    render(
      <AppLike>
        <ShareAutosuggest
          loading={loading}
          contactsAndGroups={[]}
          placeholder="myPlaceHolder"
          onPick={onPick}
          recipients={[]}
          onRemove={onRemove}
        />
      </AppLike>
    )
  }

  it('tests if ShareAutosuggest calls onPick', () => {
    const onPick = jest.fn()
    const onRemove = jest.fn()

    setup({ onPick, onRemove })

    const inputNode = screen.getByPlaceholderText('myPlaceHolder')
    // It should not call onPick if the value is not an email
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

  it('should show loading only after user focus input', () => {
    const onPick = jest.fn()
    const onRemove = jest.fn()

    setup({ onPick, onRemove, loading: true })

    const inputNode = screen.getByPlaceholderText('myPlaceHolder')

    expect(screen.queryByText('loading')).toBeNull()
    fireEvent.focus(inputNode)

    expect(screen.getByText('loading')).toBeInTheDocument()
  })
})
