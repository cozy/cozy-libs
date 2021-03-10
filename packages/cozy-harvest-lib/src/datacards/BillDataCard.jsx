import React, { useState } from 'react'
import PropTypes from 'prop-types'

import 'leaflet/dist/leaflet.css'

import Skeleton from '@material-ui/lab/Skeleton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import palette from 'cozy-ui/transpiled/react/palette'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Portal from 'cozy-ui/transpiled/react/Portal'
import Viewer from 'cozy-ui/transpiled/react/Viewer'
import Overlay from 'cozy-ui/transpiled/react/Overlay'
import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import CozyClient, {
  Q,
  useQuery,
  queryConnect,
  isQueryLoading,
  hasQueryBeenLoaded
} from 'cozy-client'

import { getFileIcon } from './mime-utils'

const LoadingBillListItem = ({ divider }) => {
  return (
    <ListItem divider={divider}>
      <ListItemIcon>
        <Skeleton variant="circle" />
      </ListItemIcon>
      <ListItemText primary={<Skeleton variant="avatar" />} />
    </ListItem>
  )
}

const BillMenu = ({ bill, anchorEl, onClose }) => {
  return (
    <Menu
      id={`bill-menu-${bill._id}`}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={onClose}>Open in Drive</MenuItem>
    </Menu>
  )
}

const BillListItem = ({ divider, bill }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [viewerIndex, setViewerIndex] = useState(null)
  const handleCloseViewer = () => setViewerIndex(null)
  const handleFileChange = (file, newIndex) => setViewerIndex(newIndex)

  const handleClick = () => setViewerIndex(0)

  const { data: file } = useQuery(
    Q(FILE_DOCTYPE).getById(bill.invoice || 'FAKE_ID')
  )
  const files = [file]
  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <ListItem
        button={Boolean(file)}
        key={bill._id}
        divider={divider}
        onClick={file ? handleClick : null}
      >
        <ListItemIcon>
          <Icon icon={getFileIcon(file)} width="32" height="32" />
        </ListItemIcon>
        <ListItemText primary={bill.name} />
        <ListItemText primary={bill.amount} />
        <ListItemSecondaryAction>
          <Typography color="textSecondary">
            <IconButton onClick={handleOpenMenu} className="u-mr-1">
              <Icon icon={DotsIcon} />
            </IconButton>
            <BillMenu anchorEl={anchorEl} bill={bill} onClose={handleClose} />
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
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
    </>
  )
}

const FILE_DOCTYPE = 'io.cozy.files'

const BillCard = ({ bills, loading, konnector }) => {
  const { t } = useI18n()
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
            <LoadingBillListItem divider />
            <LoadingBillListItem divider />
            <LoadingBillListItem divider />
            <LoadingBillListItem divider />
            <LoadingBillListItem />
          </>
        ) : (
          bills.map((bill, i) => (
            <BillListItem
              key={i}
              bill={bill}
              divider={i !== bills.length - 1}
            />
          ))
        )}
      </List>
    </Card>
  )
}

const makeQueryFromProps = ({ accountId }) => ({
  query: Q('io.cozy.bills')
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { 'cozyMetadata.createdAt': 'desc' }
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'cozyMetadata.createdAt'])
    .limitBy(5),
  as: `io.cozy.accounts/${accountId}/io.cozy.bills`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 & 1000)
})

const BillsDataCard = ({ billsCol, konnector }) => {
  const { data: bills } = billsCol
  const noFiles = hasQueryBeenLoaded(billsCol) && bills.length == 0
  const isLoading = isQueryLoading(bi
