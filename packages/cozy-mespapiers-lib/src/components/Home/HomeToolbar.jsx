/* global cozy */
import React from 'react'
import { useNavigate } from 'react-router-dom'

import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const HomeToolbar = () => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const { setIsMultiSelectionActive } = useMultiSelection()
  const { BarRight, BarLeft, BarCenter } = cozy.bar

  return (
    <>
      <BarLeft>
        <IconButton onClick={() => navigate('..')}>
          <Icon icon="previous" />
        </IconButton>
      </BarLeft>
      <BarRight>
        {!isDesktop ? (
          <IconButton onClick={() => setIsMultiSelectionActive(false)}>
            <Icon icon="cross-medium" />
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
