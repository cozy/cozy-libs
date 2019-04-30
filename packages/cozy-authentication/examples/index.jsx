import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Route, hashHistory } from 'react-router'
import 'date-fns/locale/en/index'

import 'cozy-ui/transpiled/react/stylesheet.css'
import { translate, I18n, Button } from 'cozy-ui/transpiled/react'
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

class LocaleContext extends React.Component {
  getChildContext() {
    return {
      lang: this.props.lang
    }
  }

  render() {
    return this.props.children
  }
}

LocaleContext.childContextTypes = {
  lang: PropTypes.string
}

const LangChooser = translate()(({ lang, onChange }) => (
  <div style={{ position: 'fixed', zIndex: 1 }}>
    <button onClick={onChange.bind(null, 'en')}>en</button>
    <button onClick={onChange.bind(null, 'fr')}>fr</button>
    locale: { lang }
  </div>
))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleChangeLocale = this.handleChangeLocale.bind(this)
    this.state = {
      lang: localStorage.getItem('lang') || navigator.language.substring(0, 2)
    }
  }

  handleChangeLocale(lang) {
    this.setState({ lang })
    localStorage.setItem('lang', lang)
  }

  render() {
    const { title, icon } = this.props
    return (
      <ErrorBoundary>
        <LocaleContext lang={this.state.lang}>
          <LangChooser onChange={this.handleChangeLocale.bind(this)} />
          <CozyProvider client={client}>
            <MobileRouter
              history={hashHistory}
              protocol="cozyexample://"
              appTitle={title}
              appIcon={icon}
            >
              <Route path="/" component={LoggedIn} />
            </MobileRouter>
          </CozyProvider>
        </LocaleContext>
      </ErrorBoundary>
    )
  }
}

ReactDOM.render(
  <App icon={icon} title="Example app" />,
  document.querySelector('#app')
)
