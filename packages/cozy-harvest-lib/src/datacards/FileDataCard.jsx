import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'

import 'leaflet/dist/leaflet.css'

import Skeleton from '@material-ui/lab/Skeleton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Slide from '@material-ui/core/Slide'
import Modal from '@material-ui/core/Modal'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import palette from 'cozy-ui/transpiled/react/palette'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import AppLinkCard, { AppLinkButton } from '../components/cards/AppLinkCard'
import appLinksProps from '../components/KonnectorConfiguration/DataTab/appLinksProps'

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

const FileListItem = ({ divider, file, onClick, style }) => {
  const { t, f } = useI18n()
  return (
    <ListItem
      style={style}
      button
      key={file._id}
      divider={divider}
      onClick={onClick}
    >
      <ListItemIcon>
        <Icon icon={getFileIcon(file)} width="32" height="32" />
      </ListItemIcon>
      <ListItemText
        primary={file.name}
        primaryClassName="u-ellipsis"
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

const TransitionWrapper = ({ children }) => {
  return (
    <Slide direction="left" in={true}>
      <div>{children}</div>
    </Slide>
  )
}

const FileCard = ({ files, loading, konnector, trigger }) => {
  const { t } = useI18n()

  // Remember files that were there initially so that we do not
  // animate their ListItem.
  // Only files coming from realtime and that are added to files
  // while the component is mounted will be animated.
  const [initialFilesById] = useState(() => keyBy(files, x => x._id))
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
          files.map((file, i) => {
            const shouldAnimate = !initialFilesById[file._id]
            const ItemWrapper = shouldAnimate
              ? TransitionWrapper
              : React.Fragment
            return (
              <ItemWrapper key={file._id}>
                <FileListItem
                  onClick={() => setViewerIndex(i)}
                  file={file}
                  divider={i !== files.length - 1}
                />
              </ItemWrapper>
            )
          })
        )}
      </List>
      {viewerIndex !== null && (
        <Portal into="body">
          <Modal open={true}>
            <Viewer
              files={files}
              currentIndex={viewerIndex}
              onCloseRequest={handleCloseViewer}
              onChangeRequest={handleFileChange}
            />
          </Modal>
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

const makeFolderToSaveQueryFromProps = ({ trigger }) => ({
  query: Q('io.cozy.files')
    .where({
      dir_id: trigger.message.folder_to_save,
      trashed: false
    })
    .indexFields(['dir_id', 'cozyMetadata.createdAt'])
    .sortBy([{ dir_id: 'desc' }, { 'cozyMetadata.createdAt': 'desc' }])
    .limitBy(5),
  as: `fileDataCard_io.cozy.files/${trigger.message.folder_to_save}/io.cozy.files`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
})

const makeSourceAccountQueryFromProps = ({ accountId }) => ({
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

const FileDataCard = ({
  folderToSaveFiles,
  sourceAccountFiles,
  konnector,
  trigger
}) => {
  const { data: files1 } = folderToSaveFiles
  const { data: files2 } = sourceAccountFiles

  const noFiles =
    hasQueryBeenLoaded(folderToSaveFiles) &&
    files1.length === 0 &&
    hasQueryBeenLoaded(sourceAccountFiles) &&
    files2.length === 0
  const isLoading =
    isQueryLoading(folderToSaveFiles) || isQueryLoading(sourceAccountFiles)

  const files = useMemo(() => {
    return sortBy(uniq([...files1, ...files2], x => x._id), x =>
      get(x, 'cozyMetadata.createdAt')
    )
      .reverse()
      .slice(0, 5)
  }, [files1, files2])
  return (
    <>
      <RealTimeQueries doctype="io.cozy.files" />
      {noFiles ? (
        <AppLinkCard {...appLinksProps.drive({ trigger })} />
      ) : (
        <FileCard
          files={files}
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
  folderToSaveFiles: props => makeFolderToSaveQueryFromProps(props),
  sourceAccountFiles: props => makeSourceAccountQueryFromProps(props)
})(FileDataCard)
