'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import PapersListByContact from 'src/components/Papers/PapersListByContact'

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

const setup = contact => {
  const paperList = contact
    ? mockPaperslistByContact.filter(paper => paper.contact === contact)
    : mockPaperslistByContact

  return render(
    <AppLike>
      <PapersListByContact paperslistByContact={paperList} />
    </AppLike>
  )
}

describe('PapersList components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  describe('For Alice papers', () => {
    it.each`
      data
      ${'Alice'}
      ${'File05'}
      ${'File06'}
      ${'File07'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup('Alice')
      expect(getByText(data))
    })
  })

  describe('For Bob papers', () => {
    it.each`
      data
      ${'Bob'}
      ${'File01'}
      ${'File02'}
      ${'See more (2)'}
    `(`should display "$data"`, ({ data }) => {
      const { getByText } = setup('Bob')
      expect(getByText(data))
    })
  })
})
