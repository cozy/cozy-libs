import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { I18n } from 'cozy-ui/transpiled/react/I18n'
import SharingContext from '../../context'

import langEn from '../../../locales/en.json'
import { ThumbnailSizeContextProvider } from './ThumbnailSizeContext'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { ModalContext } from './ModalContext'
import { RouterContext } from './RouterContext'
import { AcceptingSharingProvider } from './AcceptingSharingContext'
import FabProvider from './FabProvider'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))

export const TestI18n = ({ children }) => {
  return (
    <I18n lang="en" dictRequire={() => langEn}>
      {children}
    </I18n>
  )
}

const mockSharingContextValue = {
  refresh: jest.fn(),
  hasWriteAccess: jest.fn(),
  getRecipients: jest.fn(),
  getSharingLink: jest.fn()
}

const mockRouterContextValue = {
  router: {
    push: jest.fn()
  },
  params: {},
  location: { pathname: '' },
  routes: {}
}

const mockModalContextValue = {
  pushModal: jest.fn(),
  modalStack: []
}

const AppLike = ({
  children,
  store,
  client,
  sharingContextValue,
  routerContextValue,
  modalContextValue
}) => (
  <Provider store={(client && client.store) || store || mockStore}>
    <CozyProvider client={client}>
      <TestI18n>
        <SharingContext.Provider
          value={sharingContextValue || mockSharingContextValue}
        >
          <AcceptingSharingProvider>
            <RouterContext.Provider
              value={routerContextValue || mockRouterContextValue}
            >
              <ThumbnailSizeContextProvider>
                <BreakpointsProvider>
                  <ModalContext.Provider
                    value={modalContextValue || mockModalContextValue}
                  >
                    <FabProvider>{children}</FabProvider>
                  </ModalContext.Provider>
                </BreakpointsProvider>
              </ThumbnailSizeContextProvider>
            </RouterContext.Provider>
          </AcceptingSharingProvider>
        </SharingContext.Provider>
      </TestI18n>
    </CozyProvider>
  </Provider>
)

export default AppLike
