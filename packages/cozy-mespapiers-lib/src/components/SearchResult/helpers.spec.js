import { isContact } from 'cozy-client/dist/models/contact'
import { isFile } from 'cozy-client/dist/models/file'

import { makeFlexsearchResultLineOnClick } from './helpers'

jest.mock('cozy-client/dist/models/contact', () => ({
  isContact: jest.fn()
}))
jest.mock('cozy-client/dist/models/file', () => ({
  isFile: jest.fn()
}))

describe('makeFlexsearchResultLineOnClick', () => {
  const client = {
    getStackClient: () => ({ uri: 'https://cozy.localhost:8080' }),
    getInstanceOptions: () => ({ subdomain: 'cozy' })
  }
  const navigate = jest.fn()
  const navigateState = { background: '/paper/search' }
  const changeCurrentMultiSelectionFile = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return a function that opens a new tab when the doc is a contact', () => {
    window.open = jest.fn()
    isContact.mockReturnValue(true)
    const doc = {
      _id: 'contactId'
    }
    const isMultiSelectionActive = false
    const onClick = makeFlexsearchResultLineOnClick({
      client,
      doc,
      navigate,
      navigateState,
      isMultiSelectionActive,
      changeCurrentMultiSelectionFile
    })
    onClick()

    expect(window.open).toHaveBeenCalledWith(
      'https://cozy-contacts.localhost:8080/#/contactId',
      '_blank'
    )
  })

  it('should return a function that navigates to a new page when the doc is a file', () => {
    isFile.mockReturnValue(true)
    const doc = {
      _id: 'fileId',
      metadata: {
        qualification: {
          label: 'qualificationLabel'
        }
      }
    }
    const isMultiSelectionActive = false
    const onClick = makeFlexsearchResultLineOnClick({
      client,
      doc,
      navigate,
      navigateState,
      isMultiSelectionActive,
      changeCurrentMultiSelectionFile
    })
    onClick()

    expect(navigate).toHaveBeenCalledWith(
      '/paper/files/qualificationLabel/fileId',
      {
        state: { background: '/paper/search' }
      }
    )
  })

  it('should return a function that changes the current multi selection file when the doc is a file and the multi selection is active', () => {
    isFile.mockReturnValue(true)
    const doc = {
      _id: 'fileId'
    }
    const isMultiSelectionActive = true
    const onClick = makeFlexsearchResultLineOnClick({
      client,
      doc,
      navigate,
      navigateState,
      isMultiSelectionActive,
      changeCurrentMultiSelectionFile
    })
    onClick()

    expect(changeCurrentMultiSelectionFile).toHaveBeenCalledWith(doc)
  })
})
