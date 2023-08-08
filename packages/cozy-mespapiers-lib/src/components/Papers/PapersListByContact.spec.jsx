'use strict'
import { render } from '@testing-library/react'
import React from 'react'

import PapersListByContact from './PapersListByContact'
import AppLike from '../../../test/components/AppLike'
import { buildFilesByContacts } from '../Papers/helpers'

jest.mock('../Papers/helpers', () => ({
  ...jest.requireActual('../Papers/helpers'),
  getCurrentFileTheme: jest.fn(),
  buildFilesByContacts: jest.fn()
}))

jest.mock('cozy-harvest-lib', () => ({
  LaunchTriggerCard: () => <div>LaunchTriggerCard</div>
}))

jest.mock('copy-text-to-clipboard', () => ({ copy: jest.fn() }))

const mockPaperslistByContact = [
  {
    withHeader: true,
    contact: 'Bob',
    papers: {
      maxDisplay: 2,
      list: [
        { _id: '001', name: 'File01' },
        { _id: '002', name: 'File02' },
        { _id: '003', name: 'File03' },
        { _id: '004', name: 'File04' }
      ]
    }
  },
  {
    withHeader: true,
    contact: 'Alice',
    papers: {
      maxDisplay: 3,
      list: [
        { _id: '005', name: 'File05' },
        { _id: '006', name: 'File06' },
        { _id: '007', name: 'File07' }
      ]
    }
  }
]

const setup = () => {
  return render(
    <AppLike>
      <PapersListByContact
        selectedQualificationLabel={null}
        files={[{}]}
        contacts={[{}]}
      />
    </AppLike>
  )
}

describe('PapersList components:', () => {
  beforeEach(() => {
    buildFilesByContacts.mockReturnValue(mockPaperslistByContact)
  })

  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  describe('For Alice papers', () => {
    it.each`
      data
      ${'Alice'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup()
      expect(getByText(data))
    })

    it.each`
      data
      ${'File05'}
      ${'File06'}
      ${'File07'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup()
      expect(getByText(data))
    })
  })

  describe('For Bob papers', () => {
    it.each`
      data
      ${'Bob'}
      ${'See more (2)'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup()
      expect(getByText(data))
    })

    it.each`
      data
      ${'File01'}
      ${'File02'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup()
      expect(getByText(data))
    })
  })
})
