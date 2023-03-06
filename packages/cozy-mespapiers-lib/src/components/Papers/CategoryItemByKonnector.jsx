import PropTypes from 'prop-types'
import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import styles from './styles.styl'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const CategoryItemByKonnector = ({ qualificationLabel, isLast, onClick }) => {
  const scannerT = useScannerI18n()

  return (
    <>
      <ListItem button onClick={() => onClick(qualificationLabel)}>
        <ListItemIcon>
          <div className={styles['emptyKonnectorIcon']} />
        </ListItemIcon>
        <ListItemText primary={scannerT(`items.${qualificationLabel}`)} />
        <Icon icon="right" />
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </>
  )
}

CategoryItemByKonnector.propTypes = {
  qualificationLabel: PropTypes.string,
  isLast: PropTypes.bool,
  onClick: PropTypes.func
}

export default CategoryItemByKonnector
