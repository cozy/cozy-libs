import React from 'react'
import get from 'lodash/get'
import { withVaultClient, CipherType } from 'cozy-keys-lib'
import { Title } from 'cozy-ui/transpiled/react/Text'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/RaisedList'

import withLocales from '../hoc/withLocales'
import CiphersListItem from './CiphersListItem'
import OtherAccountListItem from './OtherAccountListItem'

class VaultCiphersList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      ciphers: [],
      selectedCipher: undefined
    }

    this.reset = this.reset.bind(this)
  }

  componentDidMount() {
    this.loadCiphers()
  }

  async loadCiphers() {
    this.setState({ loading: true })
    const { vaultClient, konnector } = this.props
    const konnectorURI = get(konnector, 'vendor_link')

    try {
      const ciphers = await vaultClient.getAllDecrypted({
        type: CipherType.Login,
        uri: konnectorURI
      })
      this.setState({
        ciphers
      })
    } catch (error) {
      //TODO: do something
      // eslint-disable-next-line no-console
      console.warn(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleSelectCipher(selectedCipher) {
    this.setState({ selectedCipher })
  }

  reset() {
    this.setState({ selectedCipher: undefined })
  }

  render() {
    const { t, konnector, children } = this.props
    const { ciphers, loading, selectedCipher } = this.state

    if (loading) {
      return (
        <div className="u-flex u-flex-justify-center">
          <Spinner size="xxlarge" />
        </div>
      )
    }

    if (ciphers.length === 0) {
      return children(undefined, ciphers, this.reset)
    }

    if (selectedCipher || selectedCipher === null) {
      return children(selectedCipher, ciphers, this.reset)
    }

    return (
      <>
        <Title className="u-ta-center u-mb-2">
          {t('vaultCiphersList.title')}
        </Title>
        <List>
          {ciphers.map(cipherView => (
            <CiphersListItem
              key={cipherView.id}
              cipherView={cipherView}
              konnector={konnector}
              onClick={() => this.handleSelectCipher(cipherView)}
            />
          ))}

          <OtherAccountListItem onClick={() => this.handleSelectCipher(null)} />
        </List>
      </>
    )
  }
}

export default withLocales(withVaultClient(VaultCiphersList))
