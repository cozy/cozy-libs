import { render } from '@testing-library/react'
import React from 'react'

import { I18n, useI18n } from 'twake-i18n'

import withLocales from './withLocales'

describe('withLocales', () => {
  it('should provide the sharing translations without leaking translate props', () => {
    const receivedProps = jest.fn()
    const Wrapped = withLocales(props => {
      const { t } = useI18n()
      receivedProps(props)
      return <span>{t('Share.recipients.you')}</span>
    })

    const { queryByText } = render(
      <I18n lang="en" dictRequire={() => ({})}>
        <Wrapped docId="123" />
      </I18n>
    )

    expect(receivedProps).toHaveBeenCalledWith({ docId: '123' })
    expect(queryByText('You')).toBeTruthy()
  })
})
