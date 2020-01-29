import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { Account } from 'cozy-doctypes'
import Card from 'cozy-ui/transpiled/react/Card'
import { Uppercase } from 'cozy-ui/transpiled/react/Text'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import DeleteAccountButton from '../DeleteAccountButton'
import { MountPointContext } from '../MountPointContext'

const ConfigurationTab = ({
  konnector,
  account,
  error,
  konnectorIsRunning,
  addAccount,
  onAccountDeleted,
  shouldDisplayError,
  hasLoginError,
  t
}) => {
  const { pushHistory } = useContext(MountPointContext)

  return (
    <>
      {shouldDisplayError && hasLoginError && (
        <TriggerErrorInfo
          className="u-mb-2"
          error={error}
          konnector={konnector}
        />
      )}
      {!konnector.oauth ? (
        <div className="u-mb-1">
          <Uppercase className="u-mb-half u-slateGrey u-fz-xsmall">
            {t('modal.updateAccount.title')}
          </Uppercase>
          <Card
            className="u-flex u-flex-items-center u-c-pointer"
            onClick={() => pushHistory(`/accounts/${account._id}/edit`)}
          >
            <div className="u-w-2 u-mr-1">
              <Icon icon="lock" color={palette['coolGrey']} size={36} />
            </div>
            <div className="u-flex-grow-1">
              {konnector.name}
              <div className="u-coolGrey u-fz-tiny">
                {Account.getAccountName(account)}
              </div>
            </div>
            <div>{konnectorIsRunning && <Spinner />}</div>
            <Icon icon="right" color={palette['coolGrey']} />
          </Card>
        </div>
      ) : null}
      <div className="u-flex u-flex-row">
        <DeleteAccountButton
          account={account}
          disabled={konnectorIsRunning}
          onSuccess={onAccountDeleted}
        />
        <Button
          onClick={addAccount}
          label={t('modal.addAccount.button')}
          theme="ghost"
        />
      </div>
    </>
  )
}

ConfigurationTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  error: PropTypes.object,
  konnectorIsRunning: PropTypes.bool.isRequired,
  addAccount: PropTypes.func.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  shouldDisplayError: PropTypes.bool.isRequired,
  hasLoginError: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(ConfigurationTab)
