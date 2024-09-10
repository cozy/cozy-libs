import cx from 'classnames'
import React, { createRef } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import Viewer from './Viewer'
import Footer from './components/Footer'
import InformationPanel from './components/InformationPanel'
import styles from './styles.styl'

const ViewerWithCustomPanelAndFooter = props => {
  // eslint-disable-next-line no-console
  console.warn(
    'Warning: Please do not use the "ViewerWithCustomPanelAndFooter" Component, replace it with the default export component'
  )
  const { footerProps, panelInfoProps, className, ...rest } = props
  const { files, currentIndex } = props
  const fileCount = files.length
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < fileCount - 1
  const { isDesktop } = useBreakpoints()
  const toolbarRef = createRef()
  const currentFile = files[currentIndex]

  const showInfoPanel =
    isDesktop &&
    panelInfoProps &&
    panelInfoProps.showPanel({ file: currentFile })

  return (
    <div
      id="viewer-wrapper"
      className={cx(styles['viewer-wrapper'], className)}
    >
      <Viewer
        {...rest}
        disablePanel={true}
        disableFooter={true}
        currentFile={currentFile}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        validForPanel={showInfoPanel}
        toolbarRef={toolbarRef}
      />
      <Footer>
        <footerProps.FooterContent file={currentFile} toolbarRef={toolbarRef} />
      </Footer>
      {showInfoPanel && (
        <InformationPanel>
          <panelInfoProps.PanelContent file={currentFile} />
        </InformationPanel>
      )}
    </div>
  )
}

export default ViewerWithCustomPanelAndFooter
