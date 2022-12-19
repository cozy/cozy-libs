import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { models, useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CardMedia from 'cozy-ui/transpiled/react/CardMedia'
import FileImageLoader from 'cozy-ui/transpiled/react/FileImageLoader'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import RenameInput from './Renaming/RenameInput'
import ExpirationAnnotation from './ExpirationAnnotation'

const { isExpired, isExpiringSoon } = models.paper

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
  divider,
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

  const handleClick = () => {
    if (isMultiSelectionChoice) {
      changeCurrentMultiSelectionFile(paper)
    } else {
      navigate(`/paper/files/${paperTheme}/${paper._id}`, {
        state: { background: `${pathname}${search}` }
      })
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

  const secondaryText = (
    <>
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
                <CardMedia component="img" width={32} height={32} image={src} />
              )
            }}
            renderFallback={() => <Icon icon="file-type-pdf" size={32} />}
          />
        </ListItemIcon>
        {isRenaming ? (
          <RenameInput file={paper} onClose={() => setIsRenaming(false)} />
        ) : (
          <ListItemText
            className="u-mr-1"
            primary={
              validPageName(paperLabel)
                ? t(`PapersList.label.${paperLabel}`)
                : paper.name
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

      {divider && (
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
  divider: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  withCheckbox: PropTypes.bool,
  isRenaming: PropTypes.bool,
  setIsRenaming: PropTypes.func
}

export default PaperItem
