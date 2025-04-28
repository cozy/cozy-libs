import { render } from '@testing-library/react'
import React from 'react'

import flag from 'cozy-flags'

import { ShareModal } from './ShareModal'
import AppLike from '../../test/AppLike'

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

  it('should render ShareDialogCozyToCozy if type is Notes', () => {
    const root = setup({ documentType: 'Notes' })

    expect(root.getByText('ShareDialogCozyToCozy'))
  })

  it('should render ShareDialogOnlyByLink if flag cozy.hide-sharing-cozy-to-cozy is true', () => {
    flag.mockImplementation(() => true)

    const root = setup({ documentType: 'Document' })

    expect(root.getByText('ShareDialogOnlyByLink'))
  })
})
