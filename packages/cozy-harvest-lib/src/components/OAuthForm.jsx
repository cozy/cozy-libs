import React, { PureComponent } from 'react'

import Button from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

export class OAuthForm extends PureComponent {
  render() {
    const { initialValues, t } = this.props
    return initialValues ? null : (
      <Button
        className="u-mt-1"
        extension="full"
        label={t('oauth.connect.label')}
      />
    )
  }
}

export default translate()(OAuthForm)
