import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import AppLinker, { generateWebLink } from 'cozy-ui/transpiled/react/AppLinker'
import { Button, ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { Title, Caption } from 'cozy-ui/transpiled/react/Text'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'

import Illustration from './Illustration'
import DataTypes from './DataTypes'
import { getDataTypes, getKonnectorName } from '../../helpers/manifest'
import { getSuggestionReason } from '../../helpers/appSuggestions'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import withMobileDialog from '@material-ui/core/withMobileDialog'

const KonnectorSuggestionModal = ({
  t,
  client,
  konnectorAppSuggestion,
  konnectorManifest,
  onClose,
  onSilence,
  fullScreen
}) => {
  const { slug } = konnectorAppSuggestion
  const cozyURL = new URL(client.getStackClient().uri)
  const storeAppName = 'store'
  const nativePath = `/discover/${slug}`
  const { cozySubdomainType: subDomainType } = client.getInstanceOptions()
  const [isSilencing, setIsSilencing] = useState(false)

  const dataTypes = getDataTypes(konnectorManifest) || []
  const name = getKonnectorName(konnectorManifest) || slug
  const { code: reason } = getSuggestionReason(konnectorAppSuggestion)

  const silenceSuggestion = async () => {
    try {
      setIsSilencing(true)
      await client.save({ ...konnectorAppSuggestion, silenced: true })
    } finally {
      setIsSilencing(false)
      onSilence()
    }
  }

  return (
    <MuiCozyTheme>
      <Dialog
        open
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        scroll="body"
      >
        <DialogCloseButton onClick={onClose} />
        <DialogContent>
          <div className="u-flex u-flex-column u-flex-items-center">
            <Illustration alt={t('app.logo.alt', { name })} app={slug} />
            <Title className="u-mb-half">
              {t('suggestions.title', { name })}
            </Title>
            <DataTypes dataTypes={dataTypes} konnectorName={name} />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="u-flex u-flex-column u-flex-items-center">
            {reason === 'FOUND_TRANSACTION' && (
              <Caption className="u-mb-1">
                {t('suggestions.why', { name })}
                <br />
                {t('suggestions.reason_bank', { name })}
              </Caption>
            )}
            <AppLinker
              slug={storeAppName}
              nativePath={nativePath}
              href={generateWebLink({
                cozyUrl: cozyURL.origin,
                slug: storeAppName,
                nativePath,
                subDomainType
              })}
            >
              {({ onClick, href }) => (
                <ButtonLink
                  onClick={onClick}
                  href={href}
                  label={t('suggestions.install')}
                  extension="full"
                  className="u-mb-half"
                />
              )}
            </AppLinker>
            <Button
              theme="secondary"
              label={t('suggestions.silence')}
              onClick={silenceSuggestion}
              busy={isSilencing}
              extension="full"
            />
          </div>
        </DialogActions>
      </Dialog>
    </MuiCozyTheme>
  )
}

KonnectorSuggestionModal.propTypes = {
  t: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  konnectorAppSuggestion: PropTypes.shape({
    // io.cozy.apps.suggestions, see https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.apps.suggestions.md
    slug: PropTypes.string,
    silenced: PropTypes.bool,
    reason: PropTypes.shape({
      code: PropTypes.string
    })
  }).isRequired,
  konnectorManifest: PropTypes.shape({
    dataTypes: PropTypes.array,
    name: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onSilence: PropTypes.func.isRequired
}

export default withClient(
  translate()(withMobileDialog()(KonnectorSuggestionModal))
)
