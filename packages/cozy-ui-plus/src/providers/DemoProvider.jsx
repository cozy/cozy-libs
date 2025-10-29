import React from 'react'

import { CozyProvider } from 'cozy-client'
import DumbDemoProvider from 'cozy-ui/transpiled/react/providers/DemoProvider'

const defaultClient = {
  plugins: {
    realtime: {
      subscribe: () => {},
      unsubscribe: () => {},
      unsubscribeAll: () => {}
    }
  },
  getStackClient: () => ({
    uri: 'https://cozy.io/'
  }),
  getInstanceOptions: () => ({
    subdomain: ''
  })
}

const DemoProvider = ({ client, children, ...props }) => {
  return (
    <CozyProvider client={client || defaultClient}>
      <DumbDemoProvider {...props}>{children}</DumbDemoProvider>
    </CozyProvider>
  )
}

export default DemoProvider
