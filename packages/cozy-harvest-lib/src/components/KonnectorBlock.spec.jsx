import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import KonnectorBlock from './KonnectorBlock'
import AppLike from '../../test/AppLike'
import { fetchKonnectorData } from '../helpers/konnectorBlock'
import en from '../locales/en.json'

jest.mock('../helpers/konnectorBlock', () => ({
  fetchKonnectorData: jest.fn()
}))

const client = createMockClient({})
client.getStackClient = jest.fn(() => ({ uri: 'http://cozy.tools:8080' }))

const setup = ({ file = {} } = {}) => {
  const root = render(
    <AppLike client={client}>
      <KonnectorBlock file={file} />
    </AppLike>
  )
  return { root }
}

describe('KonnectorBlock', () => {
  it('should show a spinner while there is no data to show', () => {
    const { root } = setup()
    const { getByTestId } = root

    expect(getByTestId('KonnectorBlock-spinner'))
  })

  it('should show konnector title and its link, also customer account and its link', async () => {
    fetchKonnectorData.mockResolvedValue({
      name: 'Pajemploi',
      link: 'https://links.mycozy.cloud/home/connected/pajemploi/accounts/012345?fallback=http%3A%2F%2Fcozy-home.tools%3A8080%2F%23%2Fconnected%2Fpajemploi%2Faccounts%2F012345',
      trigger: { current_state: {} },
      vendorLink: {
        component: 'a',
        href: 'https://www.pajemploi.urssaf.fr/',
        target: '_blank'
      }
    })

    const { root } = setup({
      file: {
        cozyMetadata: {
          uploadedBy: { slug: 'pajemploi' },
          sourceAccount: '012345'
        }
      }
    })
    const { getByText } = root

    await waitFor(() => {
      expect(getByText('Pajemploi').closest('a')).toHaveAttribute(
        'href',
        `https://links.mycozy.cloud/home/connected/pajemploi/accounts/012345?fallback=${encodeURIComponent(
          'http://cozy-home.tools:8080/#/connected/pajemploi/accounts/012345'
        )}`
      )
      expect(getByText('https://www.pajemploi.urssaf.fr/'))
      expect(
        getByText('https://www.pajemploi.urssaf.fr/').closest('a')
      ).toHaveAttribute('href', 'https://www.pajemploi.urssaf.fr/')
      expect(getByText(en.konnectorBlock.store.primary))
      expect(getByText(en.konnectorBlock.store.secondary))
    })
  })

  it('should show fatal error correctly', async () => {
    fetchKonnectorData.mockResolvedValue({
      fatalError: 'Fatal error message'
    })

    const { root } = setup()
    const { getByText } = root

    await waitFor(() => {
      expect(getByText('Fatal error message'))
    })
  })
})
