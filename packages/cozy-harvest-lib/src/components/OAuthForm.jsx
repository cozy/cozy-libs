import React, { PureComponent } from 'react'

import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

export class OAuthForm extends PureComponent {
  render() {
    const { t } = this.props
    return (
      <Button
        className="u-mt-1"
        extension="full"
        label={t('oauth.connect.label')}
      />
    )
  }
}

export default translate()(OAuthForm)
