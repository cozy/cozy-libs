import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import MuiCardMedia from 'cozy-ui/transpiled/react/CardMedia'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

import { useScannerI18n } from '../Hooks/useScannerI18n'

const CategoryItemByPaper = ({ papers, category, isLast, onClick }) => {
  const client = useClient()
  const scannerT = useScannerI18n()

  return (
    <>
      <ListItem button onClick={() => onClick(category)}>
        <ListItemIcon>
          <FileImageLoader
            client={client}
            file={papers[0]}
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
        <ListItemText
          primary={scannerT(`items.${category}`, {
            smart_count: papers.length
          })}
        />
        <Icon icon="right" />
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </>
  )
}

CategoryItemByPaper.propTypes = {
  papers: PropTypes.arrayOf(PropTypes.object),
  category: PropTypes.string,
  isLast: PropTypes.bool,
  onClick: PropTypes.func
}

export default CategoryItemByPaper
