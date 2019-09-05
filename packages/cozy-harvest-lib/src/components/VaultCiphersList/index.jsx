import React from 'react'
import get from 'lodash/get'
import { withVaultClient, CipherType } from 'cozy-keys-lib'
import { Title } from 'cozy-ui/transpiled/react/Text'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/RaisedList'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import withLocales from '../hoc/withLocales'
import CipherIcon from './CipherIcon'

class VaultCiphersList extends React.Component {
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
      await vaultClient.sync()
      const ciphers = await vaultClient.getAllDecrypted({
        type: CipherType.Login,
        uri: konnectorURI
      })
      this.setState({
        ciphers
      })
    } catch (error) {
      //TODO: do something
      console.warn(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { t, konnector } = this.props
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
          {t('Depuis quel compte souhaitez-vous importer vos données ?')}
        </Title>
        <List>
          {ciphers.map(cipherView => (
            <ListItem key={cipherView.id}>
              <ListItemIcon>
                <CipherIcon konnector={konnector} />
              </ListItemIcon>
              <ListItemText
                // TODO what do we show if there is no URI ?
                primaryText={get(cipherView, 'login.uris[0]._domain')}
                secondaryText={get(cipherView, 'login.username')}
              />
            </ListItem>
          ))}

          <ListItem>
            <ListItemText primaryText={t('Depuis un autre compte…')} />
          </ListItem>
        </List>
      </>
    )
  }
}

export default withLocales(withVaultClient(VaultCiphersList))
