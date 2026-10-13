import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { ToolbarFilePath } from './ToolbarFilePath'

const file = {
  _id: 'file-id',
  _type: 'io.cozy.files',
  name: 'notes.md',
  dir_id: 'dir-id',
  driveId: 'drive-id'
}

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useClient: () => ({
    getStackClient: () => ({ uri: 'https://alice.cozy.example' }),
    getInstanceOptions: () => ({ subdomain: 'flat' })
  }),
  useQuery: () => ({
    data: { _id: 'dir-id', path: '/Space/Documents' }
  })
}))
jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => () => ({
  isDesktop: true
}))
jest.mock('../providers/ViewerProvider', () => ({
  useViewer: () => ({ file })
}))

describe('ToolbarFilePath', () => {
  it('should link to the folder in Drive by default', () => {
    render(<ToolbarFilePath />)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://alice-drive.cozy.example/#/shareddrive/drive-id/dir-id'
    )
  })

  it('should hand the click to onClick when given', () => {
    const onClick = jest.fn()
    render(<ToolbarFilePath onClick={onClick} />)

    const clicked = fireEvent.click(screen.getByRole('link'))

    expect(clicked).toBe(false)
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'file-id', dir_id: 'dir-id' })
    )
  })
})
