import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { withClient } from 'cozy-client'
import AppLinker, { generateWebLink } from 'cozy-ui/transpiled/react/AppLinker'
import { DialogCloseButton } from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogActions,
  DialogContent
} from 'cozy-ui/transpiled/react/Dialog'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Button, ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import DataTypes from './DataTypes'
import Illustration from './Illustration'
import { getSuggestionReason } from '../../helpers/appSuggestions'
import { getDataTypes, getKonnectorName } from '../../helpers/manifest'

const KonnectorSuggestionModal = ({
  t,
  client,
  konnectorAppSuggestion,
  konnectorManifest,
  onClose,
  onSilence
}) => {
  const { isMobile } = useBreakpoints()
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
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        scroll="body"
      >
        <DialogCloseButton onClick={onClose} />
        <DialogContent>
          <div className="u-flex u-flex-column u-flex-items-center">
            <Illustration alt={t('app.logo.alt', { name })} app={slug} />
            <Typography className="u-mb-half" variant="h4">
              {t('suggestions.title', { name })}
            </Typography>
            <DataTypes dataTypes={dataTypes} konnectorName={name} />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="u-flex u-flex-column u-flex-items-center u-w-100">
            {reason === 'FOUND_TRANSACTION' && (
              <Typography
                className="u-mb-1"
                variant="caption"
                color="textSecondary"
              >
                {t('suggestions.why', { name })}
                <br />
                {t('suggestions.reason_bank', { name })}
              </Typography>
            )}
            <AppLinker
              app={{ slug: storeAppName }}
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

export default withClient(translate()(KonnectorSuggestionModal))
