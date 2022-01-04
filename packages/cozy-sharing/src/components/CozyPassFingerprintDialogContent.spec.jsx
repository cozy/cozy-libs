import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import AppLike from '../../test/AppLike'

import { CozyPassFingerprintDialogContent } from './CozyPassFingerprintDialogContent'

describe('CozyPassFingerprintDialogContent', () => {
  const client = createMockClient({})
  client.options = {
    uri: 'foo.mycozy.cloud'
  }

  const setup = props =>
    render(
      <AppLike client={client}>
        <CozyPassFingerprintDialogContent {...props} />
      </AppLike>
    )

  it('shoud show the fingerprint from recipientConfirmationData', async () => {
    const props = {
      recipientConfirmationData: {
        name: 'SOME_NAME',
        email: 'SOME_EMAIL',
        fingerprintPhrase: 'SOME_FINGERPRINT'
      }
    }

    const { getByText } = setup(props)

    expect(getByText('SOME_FINGERPRINT')).toBeTruthy()
  })
})
