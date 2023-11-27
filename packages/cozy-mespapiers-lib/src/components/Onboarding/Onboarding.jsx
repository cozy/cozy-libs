import React from 'react'

import { Q, useClient } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
    <Empty
      icon={HomeCloud}
      iconSize="large"
      title={t('Home.Empty.title')}
      text={t('Home.Empty.text')}
      centered
    >
      <Button
        className="u-mb-1"
        theme="primary"
        label={t('Onboarding.cta')}
        onClick={onClick}
      />
    </Empty>
  )
}

export default Onboarding
