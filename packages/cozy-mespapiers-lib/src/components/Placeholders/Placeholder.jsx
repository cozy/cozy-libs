import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { PaperDefinitionsPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import FileIcon from '../Icons/FileIcon'

const Placeholder = forwardRef(({ placeholder, divider, onClick }, ref) => {
  const scannerT = useScannerI18n()

  return (
    <>
      <ListItem
        button
        onClick={() => onClick(placeholder)}
        ref={ref}
        data-testid="Placeholder-ListItem"
      >
        <ListItemIcon>
          <InfosBadge
            badgeContent={
              <Icon icon="plus" size={10} color="var(--primaryTextColor)" />
            }
          >
            <FileIcon icon={placeholder.icon} faded />
          </InfosBadge>
        </ListItemIcon>
        <Typography color="textSecondary">
          {scannerT(`items.${placeholder.label}`, {
            country: placeholder.country
          })}
        </Typography>
      </ListItem>
      {divider && <Divider variant="inset" component="li" />}
    </>
  )
})
Placeholder.displayName = 'Placeholder'

Placeholder.propTypes = {
  placeholder: PaperDefinitionsPropTypes.isRequired,
  divider: PropTypes.bool
}

export default React.memo(Placeholder)
