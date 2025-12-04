import { render, waitFor } from '@testing-library/react'
import React from 'react'
import I18n from 'twake-i18n'

import CozyClient, { CozyProvider } from 'cozy-client'

import ShortcutViewer from './ShortcutViewer'
import en from '../locales/en.json'

export const locales = {
  en
}

const setup = () => {
  const client = new CozyClient({})
  return (
    <CozyProvider client={client}>
      <I18n lang="en" dictRequire={() => locales['en']}>
        <ShortcutViewer file={{ id: '1' }} />
      </I18n>
    </CozyProvider>
  )
}

describe('Shortcutviewer', () => {
  it('renders the component', async () => {
    const { container } = render(setup())
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
