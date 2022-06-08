import React from 'react'
import cx from 'classnames'

import { Q, useClient } from 'cozy-client'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Button from 'cozy-ui/transpiled/react/Button'
import Empty from 'cozy-ui/transpiled/react/Empty'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { SETTINGS_DOCTYPE } from '../../doctypes'

const Onboarding = () => {
  const { t } = useI18n()
  const client = useClient()
  const { isDesktop } = useBreakpoints()

  const onClick = async () => {
    const { data } = await client.query(Q(SETTINGS_DOCTYPE))
    const settings = data?.[0] || {}
    await client.save({ ...settings, onboarded: true, _type: SETTINGS_DOCTYPE })
  }

  return (
    <Empty
      className={cx('u-p-1 u-flex-grow-1', {
        'u-flex-justify-start': isDesktop
      })}
      icon={HomeCloud}
      iconSize="large"
      title={t('Home.Empty.title')}
      text={t('Home.Empty.text')}
      layout={false}
    >
      <Button
        theme="primary"
        onClick={onClick}
        label={t('Onboarding.cta')}
        className="u-mb-1"
      />
    </Empty>
  )
}

export default Onboarding
