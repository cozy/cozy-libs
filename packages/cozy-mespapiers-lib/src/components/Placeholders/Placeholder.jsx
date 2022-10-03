import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon from 'cozy-ui/transpiled/react/Icon'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'

import FileIcon from '../Icons/FileIcon'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { PaperDefinitionsPropTypes } from '../../constants/PaperDefinitionsPropTypes'

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
          {scannerT(`items.${placeholder.label}`, placeholder.country)}
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
