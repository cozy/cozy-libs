
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

export const DumbVaultCiphersList = ({
  konnector,
  onSelect,
  ciphers,
  t,
  ...props
}) => {
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

DumbVaultCiphersList.propTypes = {
  konnector: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const VaultCiphersList = withLocales(DumbVaultCiphersList)

export default VaultCiphersList
