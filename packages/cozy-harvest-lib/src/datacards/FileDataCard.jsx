import 'leaflet/dist/leaflet.css'
import get from 'lodash/get'
import keyBy from 'lodash/keyBy'
import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'

import { RealTimeQueries } from 'cozy-client'
import Card from 'cozy-ui/transpiled/react/Card'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Slide from 'cozy-ui/transpiled/react/Slide'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/deprecated/Media'
import palette from 'cozy-ui/transpiled/react/palette'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getFileIcon } from './mime-utils'
import { useDataCardFiles } from './useDataCardFiles'
import appLinksProps from '../components/KonnectorConfiguration/DataTab/appLinksProps'
import { MountPointContext } from '../components/MountPointContext'
import AppLinkCard, { AppLinkButton } from '../components/cards/AppLinkCard'

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
        classes={{ primary: 'u-ellipsis' }}
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

const FileCard = ({ files, loading, konnector, trigger, accountId }) => {
  const { t } = useI18n()
  const { pushHistory } = useContext(MountPointContext)

  // Remember files that were there initially so that we do not
  // animate their ListItem.
  // Only files coming from realtime and that are added to files
  // while the component is mounted will be animated.
  const [initialFilesById] = useState(() => keyBy(files, x => x._id))

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
                  onClick={() => {
                    pushHistory(
                      `/viewer/${accountId}/${get(
                        trigger,
                        'message.folder_to_save'
                      )}/${i}`
                    )
                  }}
                  file={file}
                  divider={i !== files.length - 1}
                />
              </ItemWrapper>
            )
          })
        )}
      </List>
      <div className="u-ta-right u-mv-half u-mh-1">
        <AppLinkButton
          slug="drive"
          path={`#/files/${get(trigger, 'message.folder_to_save')}`}
        />
      </div>
    </Card>
  )
}

const FileDataCard = ({
  konnector,
  trigger,
  accountId,
  sourceAccountIdentifier
}) => {
  const { data, fetchStatus } = useDataCardFiles(
    sourceAccountIdentifier,
    trigger.message.folder_to_save
  )
  const isLoading = fetchStatus === 'loading'
  const noFiles = fetchStatus === 'empty' || fetchStatus === 'failed'

  return (
    <>
      <RealTimeQueries doctype="io.cozy.files" />
      {noFiles ? (
        <AppLinkCard {...appLinksProps.drive({ trigger })} />
      ) : (
        <FileCard
          files={data}
          loading={isLoading}
          konnector={konnector}
          trigger={trigger}
          accountId={accountId}
          sourceAccountIdentifier={sourceAccountIdentifier}
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

export default FileDataCard
