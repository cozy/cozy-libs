import PropTypes from 'prop-types'
import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

import CiphersListItem from './CiphersListItem'
import OtherAccountListItem from './OtherAccountListItem'
import withLocales from '../hoc/withLocales'

export const DumbVaultCiphersList = ({ konnector, onSelect, ciphers, t }) => {
  const activeCiphers = ciphers.filter(cipherView => !cipherView.deletedDate)
  return (
    <>
      <Typography className="u-ta-center u-mb-2" variant="h4">
        {t('vaultCiphersList.title')}
      </Typography>
      <Paper elevation={4}>
        <List>
          {activeCiphers.map(cipherView => (
            <CiphersListItem
              key={cipherView.id}
              cipherView={cipherView}
              konnector={konnector}
              onClick={() => onSelect(cipherView)}
            />
          ))}

          <OtherAccountListItem onClick={() => onSelect(null)} />
        </List>
      </Paper>
    </>
  )
}

DumbVaultCiphersList.propTypes = {
  konnector: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

const VaultCiphersList = withLocales(DumbVaultCiphersList)

export default VaultCiphersList
