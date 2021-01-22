import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient, useQuery } from 'cozy-client'

import AppLike from '../../test/AppLike'
import KonnectorBlock from './KonnectorBlock'
import en from '../locales/en.json'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
const client = createMockClient({})
client.getStackClient = jest.fn(() => ({ uri: 'http://cozy.tools:8080' }))

const setup = ({
  file = {},
  queryRes = {
    data: [],
    fetchStatus: 'pending',
    hasMore: false,
    fetchMore: jest.fn()
  }
} = {}) => {
  useQuery.mockReturnValue(queryRes)

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

  it('should show konnector title and its link, also customer account and its link', () => {
    const { root } = setup({
      file: {
        cozyMetadata: {
          uploadedBy: { slug: 'pajemploi' },
          sourceAccount: '012345'
        }
      },
      queryRes: {
        data: [
          {
            id: 'fromStack',
            type: 'type',
            attributes: {
              slug: 'pajemploi',
              name: 'Pajemploi',
              vendor_link: 'https://www.pajemploi.urssaf.fr/'
            }
          }
        ],
        fetchStatus: 'loaded'
      }
    })
    const { getByText } = root

    expect(getByText('Pajemploi'))
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
    expect(getByText(en.konnectorBlock.account))
  })
})
