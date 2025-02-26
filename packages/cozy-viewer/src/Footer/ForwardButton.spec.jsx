import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { makeSharingLink } from 'cozy-client/dist/models/sharing'

import ForwardButton from './ForwardButton'
import DemoProvider from '../providers/DemoProvider'

jest.mock('cozy-device-helper')
jest.mock('cozy-client/dist/models/sharing', () => ({
  ...jest.requireActual('cozy-client/dist/models/sharing'),
  makeSharingLink: jest.fn()
}))
jest.mock('./helpers')

const file = {
  _id: '123',
  name: 'filename.pdf'
}

const setup = ({ onClick }) => {
  return render(
    <DemoProvider>
      <ForwardButton file={file} onClick={onClick} />
    </DemoProvider>
  )
}

describe('ForwardButton', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('makeSharingLink', () => {
    it('should not call it if the "onClick" prop is passed', async () => {
      const onClick = jest.fn()
      const { findByTestId } = setup({ onClick })

      const btn = await findByTestId('openFileButton')
      fireEvent.click(btn)

      expect(makeSharingLink).toHaveBeenCalledTimes(0)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should call it if is on web app', async () => {
      const { findByTestId } = setup({})

      const btn = await findByTestId('openFileButton')
      fireEvent.click(btn)

      expect(makeSharingLink).toHaveBeenCalledTimes(1)
    })
  })
})
