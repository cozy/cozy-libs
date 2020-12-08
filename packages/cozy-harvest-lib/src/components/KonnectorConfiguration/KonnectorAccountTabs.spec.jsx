import React from 'react'
import { render } from '@testing-library/react'
import AppLike from '../../../test/AppLike'
import { KonnectorAccountTabsTabs } from './KonnectorAccountTabs'

describe('Konnector account tabs', () => {
  const setup = () => {
    const flowState = {
      running: false,
      error: {
        isLoginError: () => true
      }
    }

    const root = render(
      <AppLike client={{}}>
        <KonnectorAccountTabsTabs
          flowState={flowState}
          onChange={jest.fn()}
          tab={0}
        />
      </AppLike>
    )
    return { root }
  }

  it('should display the right content', () => {
    const { root } = setup()
    expect(root.getByText('Data')).toBeTruthy()
    expect(root.getByText('Configuration')).toBeTruthy()
    expect(
      root.getByRole('tab', { name: 'Configuration Warning' })
    ).toBeTruthy()
  })
})
