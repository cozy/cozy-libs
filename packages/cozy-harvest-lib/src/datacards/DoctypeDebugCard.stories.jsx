import React from 'react'

import { CozyProvider } from 'cozy-client'
import { createFakeClient } from 'cozy-client/dist/mock'

import DoctypeDebugCard from './DoctypeDebugCard'

const meta = {
  component: DoctypeDebugCard,
  render: () => {
    const data = [
      {
        _id: '180e24edac1433626f57a548481c045b',
        _rev: '1-40014a89ba8dddc04d9718461e543303',
        amount: 51.77,
        cozyMetadata: {
          createdAt: '2023-09-01T08:20:45.774Z',
          createdByApp: 'template',
          createdByAppVersion: '1.0.0',
          doctypeVersion: 1,
          metadataVersion: 1,
          sourceAccount: '180e24edac1433626f57a548481aa62d',
          sourceAccountIdentifier: 'testSourceAccountIdentifier',
          updatedAt: '2023-09-01T08:20:45.774Z',
          updatedByApps: [
            {
              date: '2023-09-01T08:20:45.774Z',
              slug: 'template',
              version: '1.0.0'
            }
          ]
        },
        currency: 'EUR',
        date: '2023-09-01T08:20:31.338Z',
        filename: '2023-09-01_template_51.77EUR.jpg',
        fileurl:
          'http://books.toscrape.com/media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg',
        invoice: 'io.cozy.files:180e24edac1433626f57a548481aca62',
        matchingCriterias: {
          labelRegex: '\\bbooks\\b'
        },
        title: 'A Light in the Attic',
        vendor: 'template'
      },
      {
        _id: '180e24edac1433626f57a548481c136e',
        _rev: '1-54702210d9be33650da61001cdff18cc',
        amount: 45.17,
        cozyMetadata: {
          createdAt: '2023-09-01T08:20:45.837Z',
          createdByApp: 'template',
          createdByAppVersion: '1.0.0',
          doctypeVersion: 1,
          metadataVersion: 1,
          sourceAccount: '180e24edac1433626f57a548481aa62d',
          sourceAccountIdentifier: 'testSourceAccountIdentifier',
          updatedAt: '2023-09-01T08:20:45.837Z',
          updatedByApps: [
            {
              date: '2023-09-01T08:20:45.837Z',
              slug: 'template',
              version: '1.0.0'
            }
          ]
        },
        currency: 'EUR',
        date: '2023-09-01T08:20:31.400Z',
        filename: '2023-09-01_template_45.17EUR.jpg',
        fileurl:
          'http://books.toscrape.com/media/cache/27/a5/27a53d0bb95bdd88288eaf66c9230d7e.jpg',
        invoice: 'io.cozy.files:180e24edac1433626f57a548481ad96a',
        matchingCriterias: {
          labelRegex: '\\bbooks\\b'
        },
        title: "It's Only the Himalayas",
        vendor: 'template'
      },
      {
        _id: '180e24edac1433626f57a548481c179f',
        _rev: '1-d1b5f977455d918b2c2b9fd27f2e8120',
        amount: 51.33,
        cozyMetadata: {
          createdAt: '2023-09-01T08:20:45.884Z',
          createdByApp: 'template',
          createdByAppVersion: '1.0.0',
          doctypeVersion: 1,
          metadataVersion: 1,
          sourceAccount: '180e24edac1433626f57a548481aa62d',
          sourceAccountIdentifier: 'testSourceAccountIdentifier',
          updatedAt: '2023-09-01T08:20:45.884Z',
          updatedByApps: [
            {
              date: '2023-09-01T08:20:45.884Z',
              slug: 'template',
              version: '1.0.0'
            }
          ]
        },
        currency: 'EUR',
        date: '2023-09-01T08:20:31.400Z',
        filename: '2023-09-01_template_51.33EUR.jpg',
        fileurl:
          'http://books.toscrape.com/media/cache/0b/bc/0bbcd0a6f4bcd81ccb1049a52736406e.jpg',
        invoice: 'io.cozy.files:180e24edac1433626f57a548481ae79c',
        matchingCriterias: {
          labelRegex: '\\bbooks\\b'
        },
        title: 'Libertarianism for Beginners',
        vendor: 'template'
      },
      {
        _id: '180e24edac1433626f57a548481c1c75',
        _rev: '1-292df85b486fe8e67ce5d4d4c5293771',
        amount: 37.59,
        cozyMetadata: {
          createdAt: '2023-09-01T08:20:45.935Z',
          createdByApp: 'template',
          createdByAppVersion: '1.0.0',
          doctypeVersion: 1,
          metadataVersion: 1,
          sourceAccount: '180e24edac1433626f57a548481aa62d',
          sourceAccountIdentifier: 'testSourceAccountIdentifier',
          updatedAt: '2023-09-01T08:20:45.935Z',
          updatedByApps: [
            {
              date: '2023-09-01T08:20:45.935Z',
              slug: 'template',
              version: '1.0.0'
            }
          ]
        },
        currency: 'EUR',
        date: '2023-09-01T08:20:31.400Z',
        filename: '2023-09-01_template_37.59EUR.jpg',
        fileurl:
          'http://books.toscrape.com/media/cache/09/a3/09a3aef48557576e1a85ba7efea8ecb7.jpg',
        invoice: 'io.cozy.files:180e24edac1433626f57a548481af3d8',
        matchingCriterias: {
          labelRegex: '\\bbooks\\b'
        },
        title: 'Mesaerion: The Best Science Fiction Stories 1800-1849',
        vendor: 'template'
      }
    ]

    const client = createFakeClient({
      queries: {
        'doctypeDebugCard_io.cozy.bills': {
          doctype: 'io.cozy.bills',
          definition: {
            doctype: 'io.cozy.bills',
            id: `io.cozy.bills/createdByApp/template/sourceAccountIdentifier/testSourceAccountIdentifier`
          },
          data
        }
      }
    })

    const konnector = {
      slug: 'template'
    }

    return (
      <CozyProvider client={client}>
        <DoctypeDebugCard
          doctype="io.cozy.bills"
          konnector={konnector}
          sourceAccountIdentifier="testSourceAccountIdentifier"
        />
      </CozyProvider>
    )
  }
}

export default meta

export const Default = {
  name: 'default'
}
