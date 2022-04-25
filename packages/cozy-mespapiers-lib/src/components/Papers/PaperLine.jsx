import React, { useState, useRef, useMemo, memo } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { models, useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ActionMenu, {
  ActionMenuHeader
} from 'cozy-ui/transpiled/react/ActionMenu'
import Filename from 'cozy-ui/transpiled/react/Filename'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CardMedia from 'cozy-ui/transpiled/react/CardMedia'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'

import { ActionsItems } from '../Actions/ActionsItems'

const validPageName = page => page === 'front' || page === 'back'
const { splitFilename } = models.file

const PaperLine = ({ paper, divider, actions }) => {
  const history = useHistory()
  const { f, t } = useI18n()
  const { isMobile } = useBreakpoints()
  const actionBtnRef = useRef()
  const client = useClient()

  const [optionFile, setOptionFile] = useState(false)

  const paperLabel = paper?.metadata?.qualification?.page
  const paperDate = paper?.metadata?.datetime
    ? f(paper?.metadata?.datetime, 'DD/MM/YYYY')
    : null

  const hideActionsMenu = () => setOptionFile(false)
  const toggleActionsMenu = () => setOptionFile(prev => !prev)

  const { filename, extension } = splitFilename({
    name: paper.name,
    type: 'file'
  })

  const linkType = useMemo(() => {
    const isImage = paper.class === 'image'
    const isPdf = paper.class === 'pdf'
    return isImage ? 'small' : isPdf ? 'icon' : undefined
  }, [paper.class])

  return (
    <>
      <ListItem
        key={paper.id}
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
                <CardMedia
                  component={'img'}
                  width={32}
                  height={32}
                  image={src}
                />
              )
            }}
            renderFallback={() => <Icon icon={'file-type-pdf'} size={32} />}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            validPageName(paperLabel)
              ? t(`PapersList.label.${paperLabel}`)
              : paper.name
          }
          secondary={paperDate}
          className={'u-mr-1'}
        />
        <ListItemSecondaryAction>
          <IconButton
            className={'u-pr-1'}
            onClick={toggleActionsMenu}
            ref={actionBtnRef}
          >
            <Icon icon={'dots'} size={16} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {divider && <Divider variant="inset" component="li" />}

      {optionFile && (
        <ActionMenu onClose={hideActionsMenu} anchorElRef={actionBtnRef}>
          {isMobile && (
            <ActionMenuHeader>
              <Filename
                icon={'file-type-pdf'}
                filename={filename}
                extension={extension}
              />
            </ActionMenuHeader>
          )}
          <ActionsItems
            actions={actions}
            file={paper}
            onClose={hideActionsMenu}
          />
        </ActionMenu>
      )}
    </>
  )
}

PaperLine.propTypes = {
  paper: PropTypes.object.isRequired,
  divider: PropTypes.bool
}

export default memo(PaperLine)
