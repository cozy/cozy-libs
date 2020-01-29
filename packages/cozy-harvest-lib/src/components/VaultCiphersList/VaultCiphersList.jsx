import React from 'react'
import PropTypes from 'prop-types'
import { Title } from 'cozy-ui/transpiled/react/Text'
import I18n from 'cozy-ui/transpiled/react/I18n'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/RaisedList'

import withLocales from '../hoc/withLocales'
import CiphersListItem from './CiphersListItem'
import OtherAccountListItem from './OtherAccountListItem'

export const DumbVaultCiphersList = ({ konnector, onSelect, ciphers, t }) => {
  return (
    <I18n lang="en" dictRequire={() => {}}>
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
    </I18n>
  )
}

DumbVaultCiphersList.propTypes = {
  konnector: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

const VaultCiphersList = withLocales(DumbVaultCiphersList)

export default VaultCiphersList
