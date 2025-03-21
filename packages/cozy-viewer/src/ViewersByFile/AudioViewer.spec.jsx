import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import AudioViewer from './AudioViewer'
import DemoProvider from '../providers/DemoProvider'

const file = {
  _id: 'audio',
  class: 'audio',
  mime: 'audio/mp3',
  name: 'sample.mp3'
}

const setup = () => {
  const root = render(
    <DemoProvider>
      <BreakpointsProvider>
        <AudioViewer file={file} />
      </BreakpointsProvider>
    </DemoProvider>
  )

  return { root }
}

describe('AudioViewer', () => {
  it('should render a spinner then the audio viewer', async () => {
    const { root } = setup()
    const { container, queryByRole } = root

    expect(queryByRole('progressbar')).toBeTruthy()

    await waitFor(() => {
      expect(queryByRole('progressbar')).toBeFalsy()
      expect(container).toMatchSnapshot()
    })
  })
})
