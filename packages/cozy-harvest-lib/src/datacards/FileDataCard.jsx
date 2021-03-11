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

import { AppLinkButton } from '../components/cards/AppLinkCard'

import CozyClient, {
  Q,
  queryConnect,
  isQueryLoading,
  hasQueryBeenLoaded,
  RealTimeQueries
} from 'cozy-client'

import { getFileIcon } from './mime-utils'

const LoadingFileListItem = ({ divider }) => {
  return (
    <ListItem divider={divider}>
      <ListItemIcon>
        <Skeleton variant="circle" />
      </ListItemIcon>
      <ListItemText primary={<Skeleton height={30.5} />} />
    </ListItem>
  )
}

const FileListItem = ({ divider, file, onClick }) => {
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
    </ListItem>
  )
}

const FileCard = ({ files, loading, konnector, trigger }) => {
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
      <div className="u-ta-right u-mv-half u-mh-1">
        <AppLinkButton
          slug="drive"
          path={`#/files/${get(trigger, 'message.folder_to_save')}`}
        />
      </div>
    </Card>
  )
}

const makeQueryFromProps = ({ accountId }) => ({
  query: Q('io.cozy.files')
    .where({
      'cozyMetadata.sourceAccount': accountId,
      trashed: false
    })
    .indexFields(['cozyMetadata.sourceAccount', 'cozyMetadata.createdAt'])
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { 'cozyMetadata.createdAt': 'desc' }
    ])
    .limitBy(5),
  as: `fileDataCard_io.cozy.accounts/${accountId}/io.cozy.files`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
})

const FileDataCard = ({ filesCol, konnector, trigger }) => {
  const { data: files } = filesCol

  const noFiles = hasQueryBeenLoaded(filesCol) && files.length == 0
  const isLoading = isQueryLoading(filesCol)
  return (
    <>
      <RealTimeQueries doctype="io.cozy.files" />
      {noFiles ? null : (
        <FileCard
          files={files.slice(0, 5)}
          loading={isLoading}
          konnector={konnector}
          trigger={trigger}
        />
      )}
    </>
  )
}

FileDataCard.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired,
  trigger: PropTypes.object.isRequired
}

export default queryConnect({
  filesCol: props => makeQueryFromProps(props)
})(FileDataCard)
