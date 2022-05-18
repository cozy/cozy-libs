/* global cozy */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const HomeToolbar = () => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const history = useHistory()
  const { setIsMultiSelectionActive } = useMultiSelection()
  const { BarRight, BarLeft, BarCenter } = cozy.bar

  return (
    <>
      <BarLeft>
        <IconButton onClick={() => history.goBack()}>
          <Icon icon={'previous'} />
        </IconButton>
      </BarLeft>
      <BarRight>
        {!isDesktop ? (
          <IconButton onClick={() => setIsMultiSelectionActive(false)}>
            <Icon icon={'cross-medium'} />
          </IconButton>
        ) : (
          <></>
        )}
      </BarRight>
      <BarCenter>
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal">
          <UIBarTitle>{t('Multiselect.select')}</UIBarTitle>
        </CozyTheme>
      </BarCenter>
    </>
  )
}

export default HomeToolbar
