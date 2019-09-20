import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { withVaultClient, CipherType } from 'cozy-keys-lib'
import { Title } from 'cozy-ui/transpiled/react/Text'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/RaisedList'

import withLocales from '../hoc/withLocales'
import CiphersListItem from './CiphersListItem'
import OtherAccountListItem from './OtherAccountListItem'

class VaultCiphersList extends React.Component {
  static propTypes = {
    konnector: PropTypes.object.isRequired,
    onNoCiphers: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    vaultClient: PropTypes.object.isRequired
  }

  state = {
    loading: false,
    ciphers: []
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

      if (ciphers.length > 0) {
        this.setState({
          ciphers,
          loading: false
        })
      } else {
        if (this.props.onNoCiphers) {
          this.props.onNoCiphers()
        }
      }
    } catch (error) {
      //TODO: do something
      // eslint-disable-next-line no-console
      console.warn(error)
      this.setState({ loading: false })
    }
  }

  render() {
    const { t, konnector, onSelect } = this.props
    const { ciphers, loading } = this.state

    if (loading) {
      return (
        <div className="u-flex u-flex-justify-center">
          <Spinner size="xxlarge" />
        </div>
      )
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
              onClick={() => onSelect(cipherView)}
            />
          ))}

          <OtherAccountListItem onClick={() => onSelect(null)} />
        </List>
      </>
    )
  }
}

export default withLocales(withVaultClient(VaultCiphersList))
