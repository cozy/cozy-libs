import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { isNote } from 'cozy-client/dist/models/file'
import { isExpired, isExpiringSoon } from 'cozy-client/dist/models/paper'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import RenameInput from 'cozy-ui/transpiled/react/ListItem/ListItemBase/Renaming/RenameInput'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MidEllipsis from 'cozy-ui/transpiled/react/MidEllipsis'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Thumbnail from 'cozy-ui/transpiled/react/Thumbnail'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import ExpirationAnnotation from './ExpirationAnnotation'
import { RemindersAnnotation } from './RemindersAnnotation'
import { generateReturnUrlToNotesIndex } from './helpers'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const useStyles = makeStyles(() => ({
  checkbox: {
    padding: 0
  },
  divider: {
    marginLeft: '6.5rem'
  }
}))

const validPageName = page => page === 'front' || page === 'back'

const PaperItem = ({
  paper,
  contactNames,
  hasDivider,
  className = '',
  classes = {},
  withCheckbox,
  children,
  isRenaming,
  setIsRenaming
}) => {
  const style = useStyles()
  const { f, t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const {
    allMultiSelectionFiles,
    isMultiSelectionActive,
    changeCurrentMultiSelectionFile,
    currentMultiSelectionFiles
  } = useMultiSelection()

  const isMultiSelectionChoice = withCheckbox && isMultiSelectionActive
  const paperTheme = paper?.metadata?.qualification?.label
  const paperLabel = paper?.metadata?.qualification?.page
  const paperDate = paper?.metadata?.datetime
    ? f(paper?.metadata?.datetime, 'DD/MM/YYYY')
    : null

  const handleClick = async () => {
    if (isMultiSelectionChoice) {
      changeCurrentMultiSelectionFile(paper)
    } else {
      if (isNote(paper)) {
        const webLink = await generateReturnUrlToNotesIndex(client, paper)
        window.open(webLink, '_self')
      } else {
        navigate(`/paper/files/${paperTheme}/${paper._id}`, {
          state: { background: `${pathname}${search}` }
        })
      }
    }
  }

  const isChecked = () => {
    return (
      currentMultiSelectionFiles.some(file => file._id === paper._id) ||
      allMultiSelectionFiles.some(file => file._id === paper._id)
    )
  }

  const isAlreadySelected = () => {
    return (
      isMultiSelectionChoice &&
      allMultiSelectionFiles.some(file => file._id === paper._id)
    )
  }

  const primaryText = validPageName(paperLabel)
    ? t(`PapersList.label.${paperLabel}`)
    : paper.name

  const secondaryText = (
    <>
      {isNote(paper) && <RemindersAnnotation file={paper} />}
      {contactNames ? contactNames : ''}
      {contactNames && paperDate ? ' · ' : ''}
      {paperDate ? paperDate : ''}
      {(isExpired(paper) || isExpiringSoon(paper)) && (
        <>
          {contactNames || paperDate ? ' · ' : ''}
          <ExpirationAnnotation file={paper} />
        </>
      )}
    </>
  )

  return (
    <>
      <ListItem
        button={!isRenaming}
        className={className}
        classes={classes}
        onClick={!isRenaming && !isAlreadySelected() ? handleClick : undefined}
        data-testid="ListItem"
        disabled={isAlreadySelected()}
      >
        {isMultiSelectionChoice && (
          <Checkbox
            checked={isChecked()}
            disabled={isAlreadySelected()}
            value={paper._id}
            className={style.checkbox}
            data-testid="Checkbox"
          />
        )}
        <ListItemIcon className={cx({ 'u-mh-1': withCheckbox })}>
          <FileImageLoader
            client={client}
            file={paper}
            linkType="tiny"
            render={src => {
              return (
                <Thumbnail>
                  {src ? (
                    <img src={src} alt="" />
                  ) : (
                    <Skeleton variant="rect" animation="wave" />
                  )}
                </Thumbnail>
              )
            }}
            renderFallback={() => (
              <Thumbnail>
                <Icon
                  icon={isNote(paper) ? 'file-type-note' : 'file-type-text'}
                />
              </Thumbnail>
            )}
          />
        </ListItemIcon>
        {isRenaming ? (
          <RenameInput file={paper} onClose={() => setIsRenaming(false)} />
        ) : (
          <ListItemText
            className="u-mr-1"
            primary={
              <span data-testid={primaryText}>
                <MidEllipsis text={primaryText} />
              </span>
            }
            secondary={secondaryText}
          />
        )}
        {children && (
          <ListItemSecondaryAction data-testid="ListItemSecondaryAction">
            {children}
          </ListItemSecondaryAction>
        )}
      </ListItem>

      {hasDivider && (
        <Divider
          variant="inset"
          component="li"
          data-testid="Divider"
          className={withCheckbox && style.divider}
        />
      )}
    </>
  )
}

PaperItem.propTypes = {
  paper: PropTypes.object.isRequired,
  contactNames: PropTypes.string,
  hasDivider: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  withCheckbox: PropTypes.bool,
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func
}

export default PaperItem
