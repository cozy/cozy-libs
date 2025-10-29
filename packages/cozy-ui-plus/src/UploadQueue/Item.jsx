import cx from 'classnames'
import React from 'react'

import { splitFilename } from 'cozy-client/dist/models/file'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Img } from 'cozy-ui/transpiled/react/deprecated/Media'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import FileUploadProgress from './FileUploadProgress'
import Pending from './Pending'
import { uploadStatus } from './index'
import styles from './styles.styl'
import { useStatusIcon } from './useStatusIcon'

const Item = ({ file, status, isDirectory, progress, getMimeTypeIcon }) => {
  const { CANCEL, LOADING, DONE_STATUSES, ERROR_STATUSES, PENDING } =
    uploadStatus
  const { filename, extension } = splitFilename(file)
  let done = false
  let error = false
  /**
   * Status came from the Upload Queue, but sometimes we're using
   * manual upload without using the Upload Queue system but we're still
   * using the UI component. When this is the case, the file handles on
   * his own its status.
   */
  const statusToUse = file.status ? file.status : status

  if (statusToUse !== LOADING && statusToUse !== CANCEL) {
    if (ERROR_STATUSES.includes(statusToUse)) {
      error = true
    } else if (DONE_STATUSES.includes(statusToUse)) {
      done = true
    }
  }

  const statusIcon = useStatusIcon(statusToUse, progress)

  const isPending =
    statusToUse !== LOADING &&
    statusToUse !== CANCEL &&
    !ERROR_STATUSES.includes(statusToUse) &&
    !DONE_STATUSES.includes(statusToUse) &&
    statusToUse === PENDING

  return (
    <ListItem
      divider
      data-testid="upload-queue-item"
      className={cx({
        [styles['upload-queue-item--done']]: done,
        [styles['upload-queue-item--error']]: error
      })}
    >
      {getMimeTypeIcon ? (
        <ListItemIcon className="u-ta-center">
          <Icon
            icon={getMimeTypeIcon(isDirectory, file.name, file.type)}
            size={32}
            className="u-mr-1"
          />
        </ListItemIcon>
      ) : null}
      <ListItemText
        disableTypography
        primary={
          <div data-testid="upload-queue-item-name" className="u-ellipsis">
            <Typography variant="body1" className="u-ellipsis">
              {filename}
              {extension && (
                <Typography
                  component="span"
                  variant="body1"
                  color="textSecondary"
                  className="u-dib"
                >
                  {extension}
                </Typography>
              )}
            </Typography>
          </div>
        }
        secondary={progress ? <FileUploadProgress progress={progress} /> : null}
      />
      {statusIcon && (
        <ListItemIcon>
          <Img>{statusIcon}</Img>
        </ListItemIcon>
      )}
      {isPending && <Pending />}
    </ListItem>
  )
}

export default translate()(Item)
