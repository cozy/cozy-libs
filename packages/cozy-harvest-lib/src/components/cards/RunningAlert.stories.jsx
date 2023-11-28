import React from 'react'

import { RunningAlert } from './RunningAlert'

const meta = {
  component: RunningAlert,
  render: () => {
    // Simulate flagship application
    window.cozy = {
      flagship: {}
    }

    return <RunningAlert />
  }
}

export default meta

export const Default = {
  name: 'default'
}
