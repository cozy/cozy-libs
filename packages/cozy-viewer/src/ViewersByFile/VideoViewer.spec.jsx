import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import VideoViewer from './VideoViewer'
import DemoProvider from '../providers/DemoProvider'

const file = {
  _id: 'video',
  class: 'video',
  mime: 'video/mp4',
  name: 'sample.mp4'
}

const setup = () => {
  const root = render(
    <DemoProvider>
      <BreakpointsProvider>
        <VideoViewer file={file} />
      </BreakpointsProvider>
    </DemoProvider>
  )

  return { root }
}

describe('VideoViewer', () => {
  it('should render a spinner then the video viewer', async () => {
    const { root } = setup()
    const { container, queryByRole } = root

    expect(queryByRole('progressbar')).toBeTruthy()

    await waitFor(() => {
      expect(queryByRole('progressbar')).toBeFalsy()
      expect(container).toMatchSnapshot()
    })
  })
})
