import { render } from '@testing-library/react'
import React from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SharingBannerCozyToCozy } from './PublicBanner'

jest.mock('cozy-ui/transpiled/react/providers/I18n')
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
          return `Shared from ![avatar](${options.image}) ${options.name}'s cozy.`
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
        discoveryLink="discoveryLink"
        onClose={() => {}}
      />
    )

    // Then
    expect(container.querySelector('.bannermarkdown').innerHTML).toEqual(
      `Shared from <img src="http://cozy.localhost:8080/public/avatar?fallback=initials" alt="avatar"> &lt;a href="https://evil.com"&gt;Click me!&lt;/a&gt;'s cozy.`
    )
  })
})
