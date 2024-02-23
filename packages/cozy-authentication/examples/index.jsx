import 'babel-polyfill'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, hashHistory } from 'react-router'
import 'date-fns/locale/en/index'

import CozyClient, { CozyProvider, withClient } from 'cozy-client'
import CozyStackClient from 'cozy-stack-client'
import { I18n, translate, Button } from 'cozy-ui/transpiled/react'
import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import 'cozy-ui/transpiled/react/stylesheet.css'

import icon from './icon.png'
import { MobileRouter } from '../dist'

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
const client = new CozyClient({
  scope: ['io.cozy.files'],
  links: [
    new CozyStackClient(),
    {
      onLogin: async function () {
        await sleep(2000) // So that we can see the logging in view
      }
    }
  ],
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

/** Shows basic info on the Cozy to which we are connected */
class DumbInformations extends React.Component {
  constructor(props) {
    super(props)
    this.state = { infos: null }
  }

  componentDidMount() {
    this.fetchInformations()
  }

  async fetchInformations() {
    const { client } = this.props
    try {
      const infos = await client.stackClient.fetchInformation()
      this.setState({ infos })
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { error, infos } = this.state
    if (error) {
      return <Error error={error} />
    }
    return infos ? <pre>{JSON.stringify(infos, null, 2)} </pre> : <div>...</div>
  }
}

const Informations = withClient(DumbInformations)

/** After login, show logout and revoke buttons */
const LoggedIn = translate()(
  withClient(({ client, t }) => (
    <div style={styles.wrapper}>
      {t('logged-in.title')}
      <br />
      URL: {client.stackClient.uri}
      <br />
      {t('logged-in.client-id')}: {client.stackClient.oauthOptions.clientID}
      <Informations />
      <div>
        <Button label={t('logged-in.logout')} onClick={() => client.logout()} />
        <Button
          label={t('logged-in.revoke')}
          onClick={() => client.handleRevocationChange(true)}
        />
      </div>
    </div>
  ))
)

const exampleLocales = {
  en: {
    'logged-in': {
      title: 'Logged in !',
      'client-id': 'Client ID',
      logout: 'Logout',
      revoke: 'Revoke'
    }
  }
}

const Error = ({ error }) => (
  <pre style={styles.error}>An error occured {error.stack}</pre>
)

/** Catch error and show it */
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

/** Provides lang passed in props inside context */
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

/** Buttons to change language */
const LangChooser = translate()(({ lang, onChange }) => (
  <div style={{ position: 'fixed', zIndex: 1 }}>
    <button onClick={onChange.bind(null, 'en')}>en</button>
    <button onClick={onChange.bind(null, 'fr')}>fr</button>
    locale: {lang}
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
          <I18n
            dictRequire={lang => exampleLocales[lang]}
            lang={this.state.lang}
          >
            <CozyProvider client={client}>
              <MobileRouter
                history={hashHistory}
                protocol="cozyexample://"
                universalLinkDomain={getUniversalLinkDomain()}
                appTitle={title}
                appIcon={icon}
                appSlug="example"
              >
                <Route path="/" component={LoggedIn} />
              </MobileRouter>
            </CozyProvider>
          </I18n>
        </LocaleContext>
        <IconSprite />
      </ErrorBoundary>
    )
  }
}

ReactDOM.render(
  <App icon={icon} title="Example app" />,
  document.querySelector('#app')
)
