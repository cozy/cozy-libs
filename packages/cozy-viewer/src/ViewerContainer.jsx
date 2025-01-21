import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { createRef, useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import { isDocumentReadOnly } from 'cozy-client/dist/models/permission'
import SharingProvider from 'cozy-sharing'
import { useSharingContext } from 'cozy-sharing'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { FileDoctype } from 'cozy-ui/transpiled/react/proptypes'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'
import EncryptedProvider from 'cozy-ui/transpiled/react/providers/Encrypted'
import { useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Viewer from './Viewer'
import ViewerInformationsWrapper from './ViewerInformationsWrapper'
import { locales } from './locales'
import { toolbarPropsPropType } from './proptypes'
import ShareModalProvider from './providers/ShareModalProvider'
import styles from './styles.styl'

const ViewerContainer = props => {
  const {
    className,
    disableFooter,
    disablePanel,
    children,
    componentsProps,
    isPublic,
    ...rest
  } = props
  const { currentIndex, files, currentURL } = props
  const toolbarRef = createRef()
  const { isDesktop } = useBreakpoints()
  const [isReadOnly, setIsReadOnly] = useState(true)
  const client = useClient()
  useExtendI18n(locales)
  const { hasWriteAccess, hasSharedParent, allLoaded } = useSharingContext()

  const currentFile = files[currentIndex]
  const fileCount = files.length
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < fileCount - 1
  const validForPanel = isDesktop && !disablePanel

  const componentsPropsWithDefault = {
    ...componentsProps,
    toolbarProps: {
      showToolbar: true,
      showClose: true,
      ...componentsProps?.toolbarProps
    }
  }

  useEffect(() => {
    const getIsReadOnly = async () => {
      const res = isPublic
        ? await isDocumentReadOnly({
            document: currentFile,
            client
          })
        : allLoaded
        ? !hasWriteAccess(
            hasSharedParent(currentFile.path)
              ? currentFile.dir_id
              : currentFile._id
          )
        : true

      setIsReadOnly(res)
    }

    getIsReadOnly()
  }, [
    client,
    currentFile,
    hasWriteAccess,
    hasSharedParent,
    allLoaded,
    isPublic
  ])

  return (
    <AlertProvider>
      <SharingProvider
        client={client}
        doctype="io.cozy.files"
        documentType="Files"
        isPublic={isPublic}
      >
        <ShareModalProvider file={currentFile}>
          <div
            id="viewer-wrapper"
            className={cx(styles['viewer-wrapper'], className)}
          >
            <EncryptedProvider url={currentURL}>
              <Viewer
                {...rest}
                isPublic={isPublic}
                componentsProps={componentsPropsWithDefault}
                currentFile={currentFile}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                validForPanel={validForPanel}
                toolbarRef={toolbarRef}
              >
                {children}
              </Viewer>
            </EncryptedProvider>
            <ViewerInformationsWrapper
              isPublic={isPublic}
              isReadOnly={isReadOnly}
              disableFooter={disableFooter}
              validForPanel={validForPanel}
              currentFile={currentFile}
              toolbarRef={toolbarRef}
            >
              {children}
            </ViewerInformationsWrapper>
          </div>
        </ShareModalProvider>
      </SharingProvider>
    </AlertProvider>
  )
}

ViewerContainer.propTypes = {
  /** One or more `io.cozy.files` to display */
  files: PropTypes.arrayOf(FileDoctype).isRequired,
  /** Index of the file to show */
  currentIndex: PropTypes.number,
  /** Optionnal URL of the file */
  currentURL: PropTypes.string,
  className: PropTypes.string,
  /** Called when the user wants to leave the Viewer */
  onCloseRequest: PropTypes.func,
  /** Called with (nextFile, nextIndex) when the user requests to navigate to another file */
  onChangeRequest: PropTypes.func,
  /** Whether to show left and right arrows to navigate between files */
  showNavigation: PropTypes.bool,
  /** A render prop that is called when a file can't be displayed */
  renderFallbackExtraContent: PropTypes.func,
  /** Show/Hide the panel containing more information about the file only on Desktop */
  disablePanel: PropTypes.bool,
  /** Show/Hide the panel containing more information about the file only on Phone & Tablet devices */
  disableFooter: PropTypes.bool,
  /** If the Viewer is in public view */
  isPublic: PropTypes.bool,
  /* Props passed to components with the same name */
  componentsProps: PropTypes.shape({
    /** Used to open an Only Office file */
    OnlyOfficeViewer: PropTypes.shape({
      /** Whether Only Office is enabled on the server */
      isEnabled: PropTypes.bool,
      /** To open the Only Office file */
      opener: PropTypes.func
    }),
    /** Toolbar properties */
    toolbarProps: PropTypes.shape(toolbarPropsPropType)
  })
}

ViewerContainer.defaultProps = {
  currentIndex: 0,
  showNavigation: true
}

const ViewerContainerWrapper = ({ disableModal, ...props }) => {
  const { type, variant } = useCozyTheme()
  const { modalProps = { open: true } } = props.componentsProps || {}

  if (disableModal) {
    return <ViewerContainer {...props} />
  }

  return (
    <Modal {...modalProps} className={`CozyTheme--${type}-${variant}`}>
      {/* This div is needed for the Modal ref */}
      <div>
        <ViewerContainer {...props} />
      </div>
    </Modal>
  )
}

ViewerContainerWrapper.defaultProps = {
  componentsProps: {
    modalProps: {
      open: true
    }
  }
}

ViewerContainerWrapper.propTypes = {
  /** To avoid wrapping the Viewer with a Modal component */
  disableModal: PropTypes.bool,
  /** Props passed to Modal component */
  componentsProps: PropTypes.shape({
    modalProps: PropTypes.object
  })
}

export default ViewerContainerWrapper
