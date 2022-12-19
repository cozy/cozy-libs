import React from 'react'
import { render } from '@testing-library/react'
import { ShareModal } from './ShareModal'
import AppLike from '../../test/AppLike'
import flag from 'cozy-flags'

jest.mock('./ShareDialogCozyToCozy', () => () => <>ShareDialogCozyToCozy</>)
jest.mock('./ShareDialogOnlyByLink', () => () => <>ShareDialogOnlyByLink</>)

jest.mock('cozy-flags')

describe('ShareModal component', () => {
  const setup = props => {
    return render(
      <AppLike>
        <ShareModal {...props} />
      </AppLike>
    )
  }

  beforeEach(() => {
    flag.mockImplementation(() => null)
  })

  it('should render ShareDialogCozyToCozy if type is Document', () => {
    const root = setup({ documentType: 'Document' })

    expect(root.getByText('ShareDialogCozyToCozy'))
  })

  it('should render ShareDialogOnlyByLink if type is Albums', () => {
    const root = setup({ documentType: 'Albums' })

    expect(root.getByText('ShareDialogOnlyByLink'))
  })

  it('should render ShareDialogCozyToCozy if type is Notes and notes.sharing-cozy-to-cozy flag enabled', () => {
    flag.mockImplementation(() => true)
    const root = setup({ documentType: 'Notes' })

    expect(root.getByText('ShareDialogCozyToCozy'))
  })

  it('should render ShareDialogOnlyByLink if type is Notes and notes.sharing-cozy-to-cozy flag disabled', () => {
    const root = setup({ documentType: 'Notes' })

    expect(root.getByText('ShareDialogOnlyByLink'))
  })
})
