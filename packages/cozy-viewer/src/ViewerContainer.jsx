import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { createRef, useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import { isDocumentReadOnly } from 'cozy-client/dist/models/permission'
import SharingProvider from 'cozy-sharing'
import { useSharingContext } from 'cozy-sharing'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import { FileDoctype } from 'cozy-ui/transpiled/react/proptypes'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import EncryptedProvider from 'cozy-ui/transpiled/react/providers/Encrypted'
import { useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Viewer from './Viewer'
import ViewerInformationsWrapper from './ViewerInformationsWrapper'
import { locales } from './locales'
import { toolbarPropsPropType } from './proptypes'
import ShareModalProvider from './providers/ShareModalProvider'
import ViewerProvider from './providers/ViewerProvider'
import styles from './styles.styl'

const ViewerContainer = props => {
  const {
    className,
    disableFooter,
    disablePanel,
    children,
    componentsProps,
    isPublic,
    currentIndex,
    files,
    currentURL,
    ...rest
  } = props
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
    <ViewerProvider
      file={currentFile}
      isPublic={isPublic}
      isReadOnly={isReadOnly}
      componentsProps={componentsPropsWithDefault}
    >
      <AlertProvider>
        <SharingProvider
          client={client}
          doctype="io.cozy.files"
          documentType="Files"
          isPublic={isPublic}
        >
          <ShareModalProvider>
            <div
              id="viewer-wrapper"
              className={cx(styles['viewer-wrapper'], className)}
            >
              <EncryptedProvider url={currentURL}>
                <Viewer
                  {...rest}
                  currentIndex={currentIndex}
                  files={files}
                  currentURL={currentURL}
                  componentsProps={componentsPropsWithDefault}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  validForPanel={validForPanel}
                  toolbarRef={toolbarRef}
                >
                  {children}
                </Viewer>
              </EncryptedProvider>
              <ViewerInformationsWrapper
                disableFooter={disableFooter}
                validForPanel={validForPanel}
                toolbarRef={toolbarRef}
              >
                {children}
              </ViewerInformationsWrapper>
            </div>
          </ShareModalProvider>
        </SharingProvider>
      </AlertProvider>
    </ViewerProvider>
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
    /** Used to spread props to Panel components */
    panel: PropTypes.shape({
      qualifications: PropTypes.shape({
        /** Whether the qualifications panel is disabled */
        disabled: PropTypes.bool
      }),
      summary: PropTypes.shape({
        /** Whether the summary panel is disabled */
        disabled: PropTypes.bool
      }),
      konnector: PropTypes.shape({
        /** Whether the konnector panel is disabled */
        disabled: PropTypes.bool
      }),
      informations: PropTypes.shape({
        /** Whether the informations panel is disabled */
        disabled: PropTypes.bool
      }),
      sharing: PropTypes.shape({
        /** Whether the sharing panel is disabled */
        disabled: PropTypes.bool
      })
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
  const { modalProps = { open: true, fullScreen: true, fullWidth: true } } =
    props.componentsProps || {}

  if (disableModal) {
    return <ViewerContainer {...props} />
  }

  return (
    <Dialog {...modalProps}>
      <ViewerContainer {...props} />
    </Dialog>
  )
}

ViewerContainerWrapper.defaultProps = {
  componentsProps: {
    modalProps: {
      open: true,
      fullScreen: true,
      fullWidth: true
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
