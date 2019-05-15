import 'babel-polyfill'
import React from 'react'

import { hashHistory } from 'react-router'
import 'date-fns/locale/en/index'

import { CozyProvider } from 'cozy-client'

import 'cozy-ui/transpiled/react/stylesheet.css'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { I18n } from 'cozy-ui/transpiled/react'
import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'
import icon from './icon.png'
import { MobileRouter } from 'cozy-authentication'

const Error = ({ error }) => (
  <pre style={styles.error}>An error occured {error.stack}</pre>
)

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

class App extends React.Component {
  render() {
    const { title, icon, client, children, existingStore } = this.props
    return (
      <ErrorBoundary>
        <I18n dictRequire={() => ({})} lang="en">
          <CozyProvider store={existingStore} client={client}>
            <MobileRouter
              history={hashHistory}
              protocol="cozyexample://"
              universalLinkDomain={getUniversalLinkDomain()}
              appTitle={title}
              appIcon={icon}
              appSlug="example"
            >
              {children}
            </MobileRouter>
          </CozyProvider>
        </I18n>
        <IconSprite />
      </ErrorBoundary>
    )
  }
}

App.defaultProps = {
  title: 'Example App',
  icon
}

export default App
