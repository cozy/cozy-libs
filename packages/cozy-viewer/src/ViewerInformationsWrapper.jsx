import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useSetFlagshipUI } from 'cozy-ui/transpiled/react/hooks/useSetFlagshipUi/useSetFlagshipUI'
import { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useTheme } from 'cozy-ui/transpiled/react/styles'

import FooterContent from './Footer/FooterContent'
import AIAssistantPanel from './Panel/AI/AIAssistantPanel'
import PanelContent from './Panel/PanelContent'
import Footer from './components/Footer'
import InformationPanel from './components/InformationPanel'
import { useViewer } from './providers/ViewerProvider'

const ViewerInformationsWrapper = ({
  disableFooter,
  validForPanel,
  toolbarRef,
  children
}) => {
  const theme = useTheme()
  const { isLight } = useCozyTheme()
  const { isOpenAiAssistant, setIsOpenAiAssistant } = useViewer()
  const sidebar = document.querySelector('[class*="sidebar"]')
  const location = useLocation()

  useEffect(() => {
    if (location?.state?.showAIAssistant) {
      setIsOpenAiAssistant(true)
    }
  }, [location, setIsOpenAiAssistant])

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
      {isOpenAiAssistant ? (
        <>
          {!disableFooter && (
            <Footer>
              <FooterContent
                toolbarRef={toolbarRef}
                isDisplayChildrenDirectly={true}
              >
                <AIAssistantPanel />
              </FooterContent>
            </Footer>
          )}
          {validForPanel && (
            <InformationPanel>
              <AIAssistantPanel />
            </InformationPanel>
          )}
        </>
      ) : (
        <>
          {!disableFooter && (
            <Footer>
              <FooterContent toolbarRef={toolbarRef}>{children}</FooterContent>
            </Footer>
          )}
          {validForPanel && (
            <InformationPanel>
              <PanelContent />
            </InformationPanel>
          )}
        </>
      )}
    </>
  )
}

ViewerInformationsWrapper.propTypes = {
  disableFooter: PropTypes.bool,
  validForPanel: PropTypes.bool,
  toolbarRef: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
}

export default ViewerInformationsWrapper
