import cx from 'classnames'
import React, { useState, useRef, useEffect } from 'react'

import { useWebviewIntent } from 'cozy-intent'
import {
  openSharingLink,
  useSharingInfos,
  useSharingContext
} from 'cozy-sharing'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import {
  makeActions,
  download,
  print
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useEncrypted } from 'cozy-ui/transpiled/react/providers/Encrypted'

import { share } from './actions/share'
import { useShareModal } from '../providers/ShareModalProvider'

const ToolbarMoreMenu = ({ file, isPublic }) => {
  const [isPrintAvailable, setIsPrintAvailable] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { isDesktop } = useBreakpoints()
  const { url } = useEncrypted()
  const anchorRef = useRef()
  const { isSharingShortcutCreated, discoveryLink } = useSharingInfos()
  const { hasWriteAccess, allLoaded } = useSharingContext()
  const webviewIntent = useWebviewIntent()
  const { setShowShareModal } = useShareModal()

  const isPDFDoc = file.mime === 'application/pdf'
  const showPrintAction = isPDFDoc && isPrintAvailable

  const isCozySharing = window.location.pathname === '/preview'

  const actions = makeActions(
    [share, openSharingLink, download, showPrintAction && print],
    {
      isSharingShortcutCreated,
      allLoaded,
      isPublic,
      hasWriteAccess,
      link: discoveryLink,
      openSharingLinkDisplayed: isCozySharing,
      setShowShareModal: setShowShareModal,
      encryptedUrl: url
    }
  )

  useEffect(() => {
    const init = async () => {
      const isAvailable =
        (await webviewIntent?.call('isAvailable', 'print')) ?? true

      setIsPrintAvailable(isAvailable)
    }

    init()
  }, [webviewIntent])

  return (
    <>
      <IconButton
        ref={anchorRef}
        variant="secondary"
        className={cx({ 'u-white': isDesktop })}
        onClick={() => setShowMenu(v => !v)}
      >
        <Icon icon={DotsIcon} />
      </IconButton>
      {showMenu && (
        <ActionsMenu
          open
          ref={anchorRef}
          docs={[file]}
          actions={actions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          autoClose
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  )
}

export default ToolbarMoreMenu
