import { render } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { CozyPassFingerprintDialogContent } from './CozyPassFingerprintDialogContent'
import AppLike from '../../test/AppLike'

describe('CozyPassFingerprintDialogContent', () => {
  const client = createMockClient({})
  client.options = {
    uri: 'foo.mycozy.cloud'
  }

  const setup = props => {
    return render(
      <AppLike client={client}>
        <CozyPassFingerprintDialogContent {...props} />
      </AppLike>
    )
  }

  it('shoud show the fingerprint from recipientConfirmationData', async () => {
    let props = {
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
