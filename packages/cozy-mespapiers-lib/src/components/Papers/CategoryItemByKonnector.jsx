import PropTypes from 'prop-types'
import React from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import styles from './styles.styl'
import { useScannerI18n } from '../Hooks/useScannerI18n'

const CategoryItemByKonnector = ({
  qualificationLabel,
  isFirst,
  isLast,
  onClick
}) => {
  const scannerT = useScannerI18n()

  return (
    <>
      {isFirst && <Divider variant="inset" component="li" />}
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
