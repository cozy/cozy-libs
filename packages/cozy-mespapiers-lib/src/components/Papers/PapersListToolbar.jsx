/* global cozy */
import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import UIBarTitle from 'cozy-ui/transpiled/react/BarTitle'
import CozyTheme from 'cozy-ui/transpiled/react/CozyTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useMultiSelection } from '../Hooks/useMultiSelection'

const PapersListToolbar = ({ title, onBack, onClose }) => {
  const { isMultiSelectionActive } = useMultiSelection()
  const { isDesktop } = useBreakpoints()
  const { BarLeft, BarRight, BarCenter } = cozy.bar

  return (
    <>
      <BarLeft>
        <IconButton onClick={onBack}>
          <Icon icon={'previous'} />
        </IconButton>
      </BarLeft>

      <BarCenter>
        {/* Need to repeat the theme since the bar is in another react portal */}
        <CozyTheme variant="normal">
          <UIBarTitle>{title}</UIBarTitle>
        </CozyTheme>
      </BarCenter>

      {isMultiSelectionActive && (
        <BarRight>
          {!isDesktop && (
            <IconButton onClick={onClose}>
              <Icon icon={'cross-medium'} />
            </IconButton>
          )}
        </BarRight>
      )}
    </>
  )
}

PapersListToolbar.propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func,
  onClose: PropTypes.func
}

export default PapersListToolbar
