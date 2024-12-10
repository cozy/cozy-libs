import '@babel/polyfill'
import 'date-fns/locale/en/index'
import React from 'react'

import { CozyProvider } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import I18n from 'cozy-ui/transpiled/react/I18n'
import IconSprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import 'cozy-ui/transpiled/react/stylesheet.css'

import icon from './icon.png'

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

const Error = ({ error }) => (
  <pre style={styles.error}>An error occured {error.stack}</pre>
)

/** Catches error and show it */
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

/** A generic App component, meant to be used by all examples  */
class App extends React.Component {
  render() {
    const { client, children, existingStore } = this.props

    return (
      <ErrorBoundary>
        <Alerter />
        <I18n dictRequire={() => ({})} lang="fr">
          <CozyProvider store={existingStore} client={client}>
            {children}
          </CozyProvider>
        </I18n>
        <IconSprite />
      </ErrorBoundary>
    )
  }
}

App.defaultProps = {
  title: 'Examples',
  icon
}

export default App
