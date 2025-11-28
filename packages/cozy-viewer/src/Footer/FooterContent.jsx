import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import BottomSheet, {
  BottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import BottomSheetContent from './BottomSheetContent'
import { extractChildrenCompByName } from './helpers'
import { useViewer } from '../providers/ViewerProvider'

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 2rem)',
    height: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    borderTop: `1px solid ${theme.palette.divider}`,
    columnGap: '0.5rem'
  },
  bottomSheetHeader: {
    columnGap: '0.5rem'
  }
}))

const FooterContent = ({ toolbarRef, children }) => {
  const styles = useStyles()
  const { file, isPublic } = useViewer()

  const toolbarProps = useMemo(() => ({ ref: toolbarRef }), [toolbarRef])

  const FooterActionButtonsWithFile = extractChildrenCompByName({
    children,
    file,
    name: 'FooterActionButtons'
  })

  const bottomSheetSettings = {
    isOpenMin: false,
    mediumHeightRatio: isPublic ? undefined : 0.5
  }

  return (
    <BottomSheet
      toolbarProps={toolbarProps}
      portalProps={{ disablePortal: true }}
      settings={bottomSheetSettings}
    >
      <BottomSheetHeader
        className={cx('u-ph-1 u-pb-1', styles.bottomSheetHeader)}
      >
        {FooterActionButtonsWithFile}
      </BottomSheetHeader>
      <BottomSheetContent />
    </BottomSheet>
  )
}

FooterContent.propTypes = {
  toolbarRef: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default FooterContent
