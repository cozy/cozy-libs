import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import BottomSheet, {
  BottomSheetHeader
} from 'cozy-ui/transpiled/react/BottomSheet'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import BottomSheetContent from './BottomSheetContent'
import { extractChildrenCompByName } from './helpers'
import PrintButton from '../components/PrintButton'

const FooterButtons = ({
  file,
  FooterActionButtonsWithFile = { FooterActionButtonsWithFile }
}) => {
  return (
    <>
      {FooterActionButtonsWithFile}
      <PrintButton file={file} variant="button" />
    </>
  )
}

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

const FooterContent = ({
  file,
  toolbarRef,
  children,
  isPublic,
  isReadOnly
}) => {
  const styles = useStyles()

  const toolbarProps = useMemo(() => ({ ref: toolbarRef }), [toolbarRef])

  const FooterActionButtonsWithFile = extractChildrenCompByName({
    children,
    file,
    name: 'FooterActionButtons'
  })

  const bottomSheetSettings = {
    isOpenMin: isPublic ? true : false,
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
        <FooterButtons
          file={file}
          FooterActionButtonsWithFile={FooterActionButtonsWithFile}
        />
      </BottomSheetHeader>
      <BottomSheetContent
        file={file}
        isPublic={isPublic}
        isReadOnly={isReadOnly}
      />
    </BottomSheet>
  )
}

FooterContent.propTypes = {
  file: PropTypes.object.isRequired,
  toolbarRef: PropTypes.object,
  isPublic: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default FooterContent
