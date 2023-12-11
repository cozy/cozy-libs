import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { useClient, Q, useQuery } from 'cozy-client'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SETTINGS_DOCTYPE } from '../../doctypes'
import { getAppSettings } from '../../helpers/queries'
import withLocales from '../../locales/withLocales'
import { usePapersCreated } from '../Contexts/PapersCreatedProvider'

const styles = { tooltip: { whiteSpace: 'pre-line' } }

const ForwardFab = ({ className, innerRef, onClick }) => {
  const { t } = useI18n()
  const client = useClient()
  const { pathname } = useLocation()
  const { countPaperCreatedByMesPapiers } = usePapersCreated()

  const { data: settings } = useQuery(
    getAppSettings.definition,
    getAppSettings.options
  )

  const hideForwardFabTooltip = settings?.[0]?.hideForwardFabTooltip
  const isHome = pathname === '/paper'

  const open =
    isHome && countPaperCreatedByMesPapiers === 1 && !hideForwardFabTooltip

  const hideTooltip = async () => {
    if (!open || !isHome) return null

    const { data } = await client.query(Q(SETTINGS_DOCTYPE))
    const settings = data?.[0] || {}
    await client.save({
      ...settings,
      _type: SETTINGS_DOCTYPE,
      hideForwardFabTooltip: true
    })
  }

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={hideTooltip}>
      <Tooltip
        open={open}
        title={<div style={styles.tooltip}>{t('Home.Fab.tooltip')}</div>}
      >
        <Fab
          className={cx('u-mr-half', className)}
          innerRef={innerRef}
          onClick={() => {
            hideTooltip()
            onClick()
          }}
          aria-label={t('Home.Fab.forwardPaper')}
        >
          <Icon icon="reply" />
        </Fab>
      </Tooltip>
    </ClickAwayListener>
  )
}

ForwardFab.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  })
}

export default withLocales(ForwardFab)
