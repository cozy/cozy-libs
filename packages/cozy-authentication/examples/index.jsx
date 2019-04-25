import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, hashHistory } from 'react-router'
import 'date-fns/locale/en/index'

import 'cozy-ui/transpiled/react/stylesheet.css'
import { I18n, Button } from 'cozy-ui/transpiled/react'
import CozyClient, { CozyProvider, withClient } from 'cozy-client'

import { MobileRouter } from '../dist'
import icon from './icon.png'
import enLocale from '../src/locales/en.json'

const client = new CozyClient({
  scope: ['io.cozy.files'],
  oauth: {
    clientName: 'Example App',
    softwareID: 'io.cozy.example',
    redirectURI: 'http://localhost:1234/auth'
  }
})

const styles = {
  error: {
    background: 'crimson',
    color: 'white',
    padding: '1rem'
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
}

const LoggedIn = withClient(({ client }) => (
  <div style={styles.wrapper}>
    Logged In !<br />
    Client id: {client.stackClient.oauthOptions.clientID}
    <div>
      <Button label="Logout" onClick={() => client.logout()} />
      <Button
        label="Revoke"
        onClick={() => client.handleRevocationChange(true)}
      />
    </div>
  </div>
))

const Error = ({ error }) => (
  <pre style={styles.error}>An error occured {error.stack}</pre>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  render() {
    return this.state.error ? (
      <Error error={this.state.error} />
    ) : (
      this.props.children
    )
  }
}

class App extends React.Component {
  render() {
    const { title, icon } = this.props
    return (
      <ErrorBoundary>
        <CozyProvider client={client}>
          <I18n lang="en" dictRequire={() => enLocale}>
            {
              <MobileRouter
                history={hashHistory}
                protocol="cozyexample://"
                appTitle={title}
                appIcon={icon}
              >
                <Route path="/" component={LoggedIn} />
              </MobileRouter>
            }
          </I18n>
        </CozyProvider>
      </ErrorBoundary>
    )
  }
}

ReactDOM.render(
  <App icon={icon} title="Example app" />,
  document.querySelector('#app')
)
