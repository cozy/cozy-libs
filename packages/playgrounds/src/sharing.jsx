import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './common/App'
import client from './common/client'
import { Route } from 'react-router'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-sharing/dist/stylesheet.css'

import { queryConnect } from 'cozy-client'

import SharingProvider, { ShareButton, ShareModal } from 'cozy-sharing'
import withLocales from 'cozy-sharing/dist/withLocales'

const reducer = combineReducers({
  cozy: client.reducer()
})

// get a directory
// const FileCollection = client.getStackClient().collection('io.cozy.files')
//const rootDir = FileCollection.get('io.cozy.files.root-dir')

//console.log(rootDir)
//console.log(client)

const store = createStore(reducer)
const LocalizedSharingProvider = withLocales(SharingProvider)

const MySharing = props => {
  const file = props.file
  const docId = file.id
  return <>
    <ShareButton docId={docId} />
    <ShareModal document={file} />
  </>
}

export const WithFirstChild = (props) => {
  if (props.file.fetchStatus == 'loaded') {
    const Component = props.component
    return <Component file={props.file.data.relationships.contents.data[0]} {...props} />
  } else {
    return <p>{props.file.fetchStatus}</p>
  }
}

export const WithFile = queryConnect({
  file: {
    query: client => client.all('io.cozy.files').getById( 'io.cozy.files.root-dir'),
    as: 'file'
  }
})(WithFirstChild)

const MyComponent = () => {
  return (
    <LocalizedSharingProvider doctype="io.cozy.files" documentType="Files">
      <WithFile component={MySharing} />
    </LocalizedSharingProvider>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App client={client} existingStore={store}>
      <Route path="/" component={MyComponent} />
    </App>
  </Provider>,
  document.querySelector('#app')
)
