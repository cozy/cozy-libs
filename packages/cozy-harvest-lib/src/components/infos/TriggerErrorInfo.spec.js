import React from 'react'
import { render } from '@testing-library/react'

import AppLike from '../../../test/AppLike'
import TriggerErrorInfo from 'components/infos/TriggerErrorInfo'
import { KonnectorJobError } from 'helpers/konnectors'

const fixtures = {
  konnector: {
    name: 'Konnectest',
    vendor_link: 'https://cozy.io'
  },
  error: new KonnectorJobError('LOGIN_FAILED')
}

const tMock = jest.fn().mockImplementation(key => key)

describe('TriggerErrorInfo', () => {
  let fakeClient
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  const props = {
    error: fixtures.error,
    konnector: fixtures.konnector,
    t: tMock
  }

  const setup = ({ props: optionProps } = {}) => {
    fakeClient = {
      fetchQueryAndGetFromState: jest.fn()
    }
    const root = render(
      <AppLike client={fakeClient}>
        <TriggerErrorInfo {...props} {...optionProps} />
      </AppLike>
    )
    return { root }
  }

  it('should render', () => {
    const { root } = setup()
    expect(root.getByText('Incorrect or expired credentials')).toBeTruthy()
  })

  it('should render regular Error', () => {
    const { root } = setup({
      props: {
        error: new Error('Something is undefined')
      }
    })
    expect(root.findByText('An unknown error has occurred.')).toBeTruthy()
  })

  it('should render unknown error with configured mail support if any', () => {
    fakeClient.fetchQueryAndGetFromState.mockResolvedValue({
      data: [{ attributes: { support_address: 'test@address' } }]
    })
    const { root } = setup({
      props: {
        error: new Error('Something is undefined')
      }
    })
    expect(root.findByText('test@address')).toBeTruthy()
  })
})
