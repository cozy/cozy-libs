import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'

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
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import { getLinksType } from '../../utils/getLinksType'
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
  divider,
  className = '',
  classes = {},
  withCheckbox,
  children
}) => {
  const style = useStyles()
  const { f, t } = useI18n()
  const client = useClient()
  const history = useHistory()
  const {
    isMultiSelectionActive,
    changeCurrentMultiSelectionFile,
    currentMultiSelectionFiles
  } = useMultiSelection()

  const paperTheme = paper?.metadata?.qualification?.label
  const paperLabel = paper?.metadata?.qualification?.page
  const paperDate = paper?.metadata?.datetime
    ? f(paper?.metadata?.datetime, 'DD/MM/YYYY')
    : null

  const handleClick = () => {
    if (isMultiSelectionActive && withCheckbox) {
      changeCurrentMultiSelectionFile(paper)
    } else {
      history.push({
        pathname: `/paper/file/${paperTheme}/${paper._id}`
      })
    }
  }

  const isChecked = () => {
    return currentMultiSelectionFiles.some(file => file._id === paper._id)
  }

  const secondaryText = `${contactNames ? contactNames : ''}${
    contactNames && paperDate ? ' · ' : ''
  }${paperDate ? paperDate : ''}`

  return (
    <>
      <ListItem
        button
        className={className}
        classes={classes}
        onClick={handleClick}
        data-testid="ListItem"
      >
        {withCheckbox && isMultiSelectionActive && (
          <Checkbox
            checked={isChecked()}
            value={paper._id}
            className={style.checkbox}
            data-testid="Checkbox"
          />
        )}
        <ListItemIcon className={cx({ 'u-mh-1': withCheckbox })}>
          <FileImageLoader
            client={client}
            file={paper}
            linkType={getLinksType(paper)}
            render={src => {
              return (
                <CardMedia component="img" width={32} height={32} image={src} />
              )
            }}
            renderFallback={() => <Icon icon="file-type-pdf" size={32} />}
          />
        </ListItemIcon>
        <ListItemText
          className="u-mr-1"
          primary={
            validPageName(paperLabel)
              ? t(`PapersList.label.${paperLabel}`)
              : paper.name
          }
          secondary={secondaryText}
        />
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
  withCheckbox: PropTypes.bool
}

export default PaperItem
