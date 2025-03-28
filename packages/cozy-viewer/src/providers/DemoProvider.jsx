import React, { Fragment } from 'react'

import { CozyProvider } from 'cozy-client'
import CloudWallpaper from 'cozy-ui/docs/cloud-wallpaper.jpg'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import ViewerProvider from './ViewerProvider'
import { locales } from '../locales/index'

const demoTextFileResponse = {
  text: () => new Promise(resolve => resolve('Hello World !'))
}

const demoFilesByClass = {
  pdf: 'https://raw.githubusercontent.com/rospdf/pdf-php/2ccf7591fc2f18e63342ebfedad7997b08c34ed2/readme.pdf',
  audio: 'https://viewerdemo.cozycloud.cc/Z.mp3',
  video: 'https://viewerdemo.cozycloud.cc/Nextcloud.mp4',
  text: 'https://viewerdemo.cozycloud.cc/notes.md'
}

const mockClient = {
  plugins: {
    realtime: {
      subscribe: () => {},
      unsubscribe: () => {},
      unsubscribeAll: () => {}
    }
  },
  on: () => {},
  collection: () => ({
    getDownloadLinkById: id =>
      new Promise(resolve => resolve(demoFilesByClass[id])),
    download: () =>
      alert(
        "This is a demo, there's no actual Cozy to download the file from ¯\\_(ツ)_/¯"
      ),
    get: () =>
      new Promise(resolve =>
        resolve({
          data: {
            links: {
              large: CloudWallpaper
            }
          }
        })
      )
  }),
  getStackClient: () => ({
    uri: '',
    fetch: () => new Promise(resolve => resolve(demoTextFileResponse))
  }),
  getClient: () => mockClient,
  store: {
    getState: () => {},
    subscribe: () => {},
    unsubscribe: () => {}
  },
  getQueryFromState: queryName => {
    if (queryName === 'io.cozy.files/parent_folder') {
      return {
        data: {
          _id: 'parent_id',
          path: '/Parent'
        }
      }
    }
  },
  query: () => ({
    data: [{ attributes: { slug: 'mespapiers' }, links: { related: '' } }]
  }),
  getInstanceOptions: () => ({ app: { slug: 'mespapiers' }, subdomain: 'flat' })
}

const ViewerContainer = ({ file, isPublic, isReadOnly, children }) => {
  return (
    <ViewerProvider file={file} isPublic={isPublic} isReadOnly={isReadOnly}>
      {children}
    </ViewerProvider>
  )
}

ViewerContainer.defaultProps = {
  file: {},
  isPublic: false,
  isReadOnly: false
}

const DemoProvider = ({
  file,
  isPublic,
  isReadOnly,
  withContainer,
  children
}) => {
  const lang = localStorage.getItem('lang') || 'en'

  const Wrapper = withContainer ? ViewerContainer : Fragment
  const wrapperProps = withContainer ? { file, isPublic, isReadOnly } : {}

  return (
    <CozyProvider client={mockClient}>
      <BreakpointsProvider>
        <I18n dictRequire={lang => locales[lang]} lang={lang}>
          <AlertProvider>
            <Wrapper {...wrapperProps}>{children}</Wrapper>
          </AlertProvider>
        </I18n>
      </BreakpointsProvider>
    </CozyProvider>
  )
}

export default DemoProvider
