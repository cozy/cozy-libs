import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  act
} from '@testing-library/react'
import React from 'react'

import { useSessionstorage } from './useSessionstorage'

describe('useSessionstorage defined', () => {
  it('should be defined', () => {
    expect(useSessionstorage).toBeDefined()
  })
})

describe('useSessionstorage basic', () => {
  let App
  beforeEach(() => {
    // eslint-disable-next-line react/display-name
    App = function () {
      const [value, set] = useSessionstorage('test-key', 'test value')

      return (
        <div data-testid="container">
          <p data-testid="value">{value}</p>
          <button
            data-testid="new-value"
            onClick={() => {
              set('new test value')
            }}
          >
            Set to new value
          </button>
        </div>
      )
    }
  })

  afterEach(cleanup)

  it('initializes correctly', () => {
    const { container } = render(<App />)
    const valueElement = getByTestId(container, 'value')

    expect(valueElement.innerHTML).toBe('test value')
  })

  it('setting the new value', () => {
    const { container } = render(<App />)
    const setToNewValueButton = getByTestId(container, 'new-value')
    act(() => fireEvent.click(setToNewValueButton))
    const valueElement = getByTestId(container, 'value')

    expect(valueElement.innerHTML).toBe('new test value')
  })
})
