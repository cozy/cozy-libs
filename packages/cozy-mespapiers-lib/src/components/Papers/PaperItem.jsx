import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CardMedia from 'cozy-ui/transpiled/react/CardMedia'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'
import FileTypePdfIcon from 'cozy-ui/transpiled/react/icons/FileTypePdf'

const validPageName = page => page === 'front' || page === 'back'

const PaperItem = ({ paper, divider, children }) => {
  const history = useHistory()
  const { f, t } = useI18n()
  const client = useClient()

  const paperLabel = paper?.metadata?.qualification?.page
  const paperDate = paper?.metadata?.datetime
    ? f(paper?.metadata?.datetime, 'DD/MM/YYYY')
    : null

  const linkType = useMemo(() => {
    const isImage = paper.class === 'image'
    const isPdf = paper.class === 'pdf'
    return isImage ? 'small' : isPdf ? 'icon' : undefined
  }, [paper.class])

  return (
    <>
      <ListItem
        button
        onClick={() =>
          history.push({
            pathname: `/paper/file/${paper.id}`
          })
        }
      >
        <ListItemIcon>
          <FileImageLoader
            client={client}
            file={paper}
            linkType={linkType}
            render={src => {
              return (
                <CardMedia component="img" width={32} height={32} image={src} />
              )
            }}
            renderFallback={() => <Icon icon={FileTypePdfIcon} size={32} />}
          />
        </ListItemIcon>
        <ListItemText
          className="u-mr-1"
          primary={
            validPageName(paperLabel)
              ? t(`PapersList.label.${paperLabel}`)
              : paper.name
          }
          secondary={paperDate}
        />
        {children && (
          <ListItemSecondaryAction>{children}</ListItemSecondaryAction>
        )}
      </ListItem>

      {divider && <Divider variant="inset" component="li" />}
    </>
  )
}

PaperItem.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool,
  children: PropTypes.node
}

export default PaperItem
