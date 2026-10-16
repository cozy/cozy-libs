import { act, render, fireEvent, screen } from '@testing-library/react'
import React from 'react'

import ShareAutosuggest from './ShareAutosuggest'
import AppLike from '../../test/AppLike'

jest.mock('cozy-ui/transpiled/react/Spinner', () => ({
  Spinner: () => <div>loading</div>
}))

describe('ShareAutosuggest', () => {
  const setup = ({
    onPick,
    onRemove,
    loading = false,
    enableCreateContact = true,
    fetchContacts
  }) => {
    render(
      <AppLike>
        <ShareAutosuggest
          loading={loading}
          contactsAndGroups={[]}
          placeholder="myPlaceHolder"
          onPick={onPick}
          recipients={[]}
          onRemove={onRemove}
          enableCreateContact={enableCreateContact}
          fetchContacts={fetchContacts}
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

  it('should not call onPick for new contacts when enableCreateContact is false', () => {
    const onPick = jest.fn()
    const onRemove = jest.fn()

    setup({ onPick, onRemove, enableCreateContact: false })

    const inputNode = screen.getByPlaceholderText('myPlaceHolder')

    fireEvent.change(inputNode, { target: { value: 'new@cozycloud.cc' } })
    fireEvent.keyPress(inputNode, { key: 'Enter', keyCode: 13, charCode: 13 })
    expect(onPick).not.toHaveBeenCalled()
  })

  it('should show loading indicator when loading prop is true (autoFocus triggers onFocus on mount)', () => {
    const onPick = jest.fn()
    const onRemove = jest.fn()

    setup({ onPick, onRemove, loading: true })

    // autoFocus triggers onFocus on mount, which sets isLoadingDisplayed
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('should not show loading indicator when loading prop is false', () => {
    const onPick = jest.fn()
    const onRemove = jest.fn()

    setup({ onPick, onRemove, loading: false })

    expect(screen.queryByText('loading')).toBeNull()
  })

  describe('with fetchContacts', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      // Not implemented by jsdom, called when a suggestion is highlighted
      Element.prototype.scrollIntoView = jest.fn()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should suggest the fetched contacts, debounced and from 3 characters', async () => {
      const fetchContacts = jest.fn().mockResolvedValue([
        {
          _id: 'org-member-1',
          _type: 'io.cozy.contacts',
          displayName: 'Jean Dupont',
          email: [{ address: 'jean@org.example', primary: true }]
        }
      ])

      setup({ onPick: jest.fn(), onRemove: jest.fn(), fetchContacts })

      const inputNode = screen.getByPlaceholderText('myPlaceHolder')
      fireEvent.change(inputNode, { target: { value: 'du' } })
      act(() => jest.runAllTimers())
      expect(fetchContacts).not.toHaveBeenCalled()

      fireEvent.change(inputNode, { target: { value: 'dup' } })
      fireEvent.change(inputNode, { target: { value: 'dupo' } })
      act(() => jest.runAllTimers())
      expect(fetchContacts).toHaveBeenCalledTimes(1)
      expect(fetchContacts).toHaveBeenCalledWith('dupo')

      expect(await screen.findByText('Jean Dupont')).toBeInTheDocument()
    })

    it('should show the loading indicator until the contacts are fetched', async () => {
      let resolveFetch
      const fetchContacts = jest.fn(
        () => new Promise(resolve => (resolveFetch = resolve))
      )

      setup({ onPick: jest.fn(), onRemove: jest.fn(), fetchContacts })

      const inputNode = screen.getByPlaceholderText('myPlaceHolder')
      fireEvent.change(inputNode, { target: { value: 'dup' } })
      expect(screen.getByText('loading')).toBeInTheDocument()

      act(() => jest.runAllTimers())
      await act(async () => resolveFetch([]))
      expect(screen.queryByText('loading')).toBeNull()
    })
  })
})
