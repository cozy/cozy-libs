import React from 'react'

import { Q, useClient } from 'cozy-client'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Button from 'cozy-ui/transpiled/react/Button'
import Empty from 'cozy-ui/transpiled/react/Empty'

import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { SETTINGS_DOCTYPE } from '../../doctypes'

const Onboarding = () => {
  const { t } = useI18n()
  const client = useClient()

  const onClick = async () => {
    const { data } = await client.query(Q(SETTINGS_DOCTYPE))
    const settings = data?.[0] || {}
    await client.save({ ...settings, onboarded: true, _type: SETTINGS_DOCTYPE })
  }

  return (
    <div
      className={
        'u-pos-fixed u-top-0 u-left-0 u-bottom-0 u-right-0 u-m-1 u-flex u-flex-column'
      }
    >
      <Empty
        icon={HomeCloud}
        iconSize={'large'}
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
        layout={false}
        className={'u-ph-1 u-flex-grow-1'}
      />
      <Button
        theme="primary"
        onClick={onClick}
        label={t('Onboarding.cta')}
        className={'u-flex-grow-0'}
      />
    </div>
  )
}

export default Onboarding
