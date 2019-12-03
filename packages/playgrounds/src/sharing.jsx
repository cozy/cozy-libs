import React, { useCallback, useState } from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'

import SharingProvider, {
  ShareButton,
  ShareModal,
  SharedStatus
} from 'cozy-sharing'
import withLocales from 'cozy-sharing/dist/withLocales'

import App from './common/App'
import client from './common/client'

import { Route } from 'react-router'

import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-sharing/dist/stylesheet.css'
import { Alerter, I18n } from 'cozy-ui/transpiled/react'

import { queryConnect } from 'cozy-client'

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

const SharingExample = props => {
  const file = props.file
  const docId = file.id
  const [showModal, setShowModal] = useState(false)
  const onClick = useCallback(() => setShowModal(!showModal), [])
  const onClose = useCallback(() => setShowModal(false), [])
  return (
    <div>
      <center>
        <ShareButton docId={docId} onClick={onClick} />
        {showModal && (
          <ShareModal
            document={{ ...file, _id: docId, _type: file.type }}
            onClose={onClose}
          />
        )}
      </center>
    </div>
  )
}
//

export const WithFirstChild = props => {
  if (props.file.fetchStatus == 'loaded') {
    const Component = props.component
    return (
      <Component
        {...props}
        file={props.file.data.relationships.contents.data[0]}
      />
    )
  } else {
    return <p>{props.file.fetchStatus}</p>
  }
}

export const WithFile = queryConnect({
  file: {
    query: client =>
      client.all('io.cozy.files').getById('io.cozy.files.root-dir'),
    as: 'file'
  }
})(WithFirstChild)

const MyExample = () => {
  return (
    <LocalizedSharingProvider doctype="io.cozy.files" documentType="Notes">
      <WithFile component={SharingExample} />
    </LocalizedSharingProvider>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App client={client} existingStore={store}>
      <Route path="/" component={MyExample} />
    </App>
  </Provider>,
  document.querySelector('#app')
)
