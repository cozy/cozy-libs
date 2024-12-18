import PropTypes from 'prop-types'
import React from 'react'

import { useSetFlagshipUI } from 'cozy-ui/transpiled/react/hooks/useSetFlagshipUi/useSetFlagshipUI'
import { FileDoctype } from 'cozy-ui/transpiled/react/proptypes'
import { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useTheme } from 'cozy-ui/transpiled/react/styles'

import FooterContent from './Footer/FooterContent'
import PanelContent from './Panel/PanelContent'
import Footer from './components/Footer'
import InformationPanel from './components/InformationPanel'

const ViewerInformationsWrapper = ({
  currentFile,
  disableFooter,
  validForPanel,
  toolbarRef,
  isPublic,
  isReadOnly,
  children
}) => {
  const theme = useTheme()
  const { isLight } = useCozyTheme()
  const sidebar = document.querySelector('[class*="sidebar"]')

  useSetFlagshipUI(
    {
      bottomBackground: theme.palette.background.paper,
      bottomTheme: isLight ? 'dark' : 'light'
    },
    {
      bottomBackground: theme.palette.background[sidebar ? 'default' : 'paper']
    }
  )

  return (
    <>
      {!disableFooter && (
        <Footer>
          <FooterContent
            file={currentFile}
            toolbarRef={toolbarRef}
            isPublic={isPublic}
          >
            {children}
          </FooterContent>
        </Footer>
      )}
      {validForPanel && (
        <InformationPanel>
          <PanelContent
            file={currentFile}
            isPublic={isPublic}
            isReadOnly={isReadOnly}
          />
        </InformationPanel>
      )}
    </>
  )
}

ViewerInformationsWrapper.propTypes = {
  currentFile: FileDoctype.isRequired,
  disableFooter: PropTypes.bool,
  validForPanel: PropTypes.bool,
  toolbarRef: PropTypes.object,
  isPublic: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default ViewerInformationsWrapper
