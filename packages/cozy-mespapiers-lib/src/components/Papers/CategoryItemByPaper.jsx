import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import MuiCardMedia from 'cozy-ui/transpiled/react/CardMedia'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'

import { useScannerI18n } from '../Hooks/useScannerI18n'

const CategoryItemByPaper = ({ paper, isLast, onClick }) => {
  const client = useClient()
  const scannerT = useScannerI18n()

  const category = paper?.metadata?.qualification?.label

  return (
    <>
      <ListItem button onClick={() => onClick(category)}>
        <ListItemIcon>
          <FileImageLoader
            client={client}
            file={paper}
            linkType="tiny"
            render={src => (
              <MuiCardMedia
                component="img"
                width={32}
                height={32}
                image={src}
              />
            )}
            renderFallback={() => <Icon icon="file-type-image" size={32} />}
          />
        </ListItemIcon>
        <ListItemText primary={scannerT(`items.${category}`)} />
        <Icon icon="right" />
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </>
  )
}

CategoryItemByPaper.propTypes = {
  paper: PropTypes.object,
  isLast: PropTypes.bool,
  onClick: PropTypes.func
}

export default CategoryItemByPaper
