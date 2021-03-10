import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import 'leaflet/dist/leaflet.css'

import Skeleton from '@material-ui/lab/Skeleton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import palette from 'cozy-ui/transpiled/react/palette'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

/*
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
*/

import CozyClient, {
  Q,
  queryConnect,
  isQueryLoading,
  hasQueryBeenLoaded
} from 'cozy-client'

import { getFileIcon } from './mime-utils'

const LoadingFileListItem = ({ divider }) => {
  return (
    <ListItem divider={divider}>
      <ListItemIcon>
        <Skeleton variant="circle" />
      </ListItemIcon>
      <ListItemText primary={<Skeleton variant="avatar" />} />
    </ListItem>
  )
}

/*
const FileMenu = ({ file, anchorEl, onClose }) => {
  return (
    <Menu
      id={`file-menu-${file._id}`}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={onClose}>Open in Drive</MenuItem>
    </Menu>
  )
}
*/

const FileListItem = ({ divider, file, onClick }) => {
  /* @TODO TO uncomment when link to drive is done
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  */
  const { t, f } = useI18n()
  return (
    <ListItem button key={file._id} divider={divider} onClick={onClick}>
      <ListItemIcon>
        <Icon icon={getFileIcon(file)} width="32" height="32" />
      </ListItemIcon>
      <ListItemText
        primary={file.name}
        secondary={
          <Typography variant="caption">
            {t('datacards.files.imported', {
              date: f(get(file, 'cozyMetadata.createdAt'), 'DD/MM/YYYY')
            })}
          </Typography>
        }
      />
      {/* <ListItemSecondaryAction>
        <Typography color="textSecondary">
          <IconButton onClick={handleOpenMenu} className="u-mr-1">
            <Icon icon={DotsIcon} />
          </IconButton>
          <FileMenu anchorEl={anchorEl} file={file} onClose={handleClose} />
        </Typography>
      </ListItemSecondaryAction>*/}
    </ListItem>
  )
}

const FileCard = ({ files, loading, konnector }) => {
  const { t } = useI18n()
  const [viewerIndex, setViewerIndex] = useState(null)
  const handleCloseViewer = () => setViewerIndex(null)
  const handleFileChange = (file, newIndex) => setViewerIndex(newIndex)
  return (
    <Card className="u-ph-0 u-pb-0 u-ov-hidden">
      <div className="u-ph-1 u-mb-half">
        <Media align="top">
          <Img>
            <Circle
              size="small"
              backgroundColor={palette.puertoRico}
              className="u-mr-1"
            >
              <Icon icon={FileIcon} color={palette.white} />
            </Circle>
          </Img>
          <Bd>
            <Typography variant="h5">{t('datacards.files.title')}</Typography>
            <Typography variant="caption">
              {t('datacards.files.caption', { konnectorName: konnector.name })}
            </Typography>
          </Bd>
        </Media>
      </div>
      <List>
        {loading ? (
          <>
            <LoadingFileListItem divider />
            <LoadingFileListItem divider />
            <LoadingFileListItem divider />
            <LoadingFileListItem divider />
            <LoadingFileListItem />
          </>
        ) : (
          files.map((file, i) => (
            <FileListItem
              key={i}
              onClick={() => setViewerIndex(i)}
              file={file}
              divider={i !== files.length - 1}
            />
          ))
        )}
      </List>
      {viewerIndex !== null && (
        <Portal into="body">
          <Overlay style={{ zIndex: 10000 }}>
            <Viewer
              files={files}
              currentIndex={viewerIndex}
              onCloseRequest={handleCloseViewer}
              onChangeRequest={handleFileChange}
            />
          </Overlay>
        </Portal>
      )}
    </Card>
  )
}

const makeQueryFromProps = ({ accountId }) => ({
  query: Q('io.cozy.files')
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { 'cozyMetadata.createdAt': 'desc' }
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'cozyMetadata.createdAt'])
    .limitBy(5),
  as: `io.cozy.accounts/${accountId}/io.cozy.files`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 & 1000)
})

const FileDataCard = ({ filesCol, konnector }) => {
  const { data: files } = filesCol
  const noFiles = hasQueryBeenLoaded(filesCol) && files.length == 0
  const isLoading = isQueryLoading(filesCol)
  return noFiles ? null : (
    <FileCard files={files} loading={isLoading} konnector={konnector} />
  )
}

FileDataCard.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired
}

export default queryConnect({
  filesCol: props => makeQueryFromProps(props)
})(FileDataCard)
