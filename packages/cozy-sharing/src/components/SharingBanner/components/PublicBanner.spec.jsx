import { render } from '@testing-library/react'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'

import { SharingBannerCozyToCozy } from './PublicBanner'

jest.mock('twake-i18n')
jest.mock('cozy-client')

describe('PublicBanner', () => {
  beforeEach(() => {
    useClient.mockReturnValue({
      options: { uri: 'http://cozy.localhost:8080' }
    })
  })

  it('should not add dangerous html', () => {
    // Given
    useI18n.mockReturnValue({
      t: (localeToTranslate, options) => {
        if (localeToTranslate === 'Share.banner.shared_from') {
          return `Shared from ![avatar](${options.image}) <strong>${options.name}</strong>'s cozy.`
        }
        return localeToTranslate
      }
    })
    const publicName = '[Click me!](https://evil.com)'
    const sharing = { attributes: { members: [{ public_name: publicName }] } }

    // When
    const { container } = render(
      <SharingBannerCozyToCozy
        sharing={sharing}
        isSharingShortcutCreated={true}
        addSharingLink="discoveryLink"
        onClose={() => {}}
      />
    )

    // Then
    expect(container.querySelector('.bannermarkdown').innerHTML).toEqual(
      `Shared from <img src="http://cozy.localhost:8080/public/avatar?fallback=initials" alt="avatar"> <strong>&lt;a href="https://evil.com"&gt;Click me!&lt;/a&gt;</strong>'s cozy.`
    )
  })
})
