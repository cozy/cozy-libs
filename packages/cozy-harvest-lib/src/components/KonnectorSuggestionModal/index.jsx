import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { generateWebLink, useClient } from 'cozy-client'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import DataTypes from './DataTypes'
import Illustration from './Illustration'
import { getSuggestionReason } from '../../helpers/appSuggestions'
import { getDataTypes, getKonnectorName } from '../../helpers/manifest'

const KonnectorSuggestionModal = ({
  konnectorAppSuggestion,
  konnectorManifest,
  onClose,
  onSilence
}) => {
  const { slug } = konnectorAppSuggestion
  const client = useClient()
  const { t } = useI18n()
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
    <CozyTheme variant="normal" className="u-pos-absolute">
      <IllustrationDialog
        open
        onClose={onClose}
        content={
          <div className="u-flex u-flex-column u-flex-items-center u-h-100">
            <Illustration alt={t('app.logo.alt', { name })} app={slug} />

            <Typography className="u-mb-half" variant="h4">
              {t('suggestions.title', { name })}
            </Typography>

            <DataTypes dataTypes={dataTypes} konnectorName={name} />

            {reason === 'FOUND_TRANSACTION' && (
              <Typography
                className="u-mb-1 u-ta-center u-mt-auto"
                variant="caption"
                color="textSecondary"
              >
                {t('suggestions.why', { name })}

                <br />

                {t('suggestions.reason_bank', { name })}
              </Typography>
            )}
          </div>
        }
        actions={
          <>
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
                <Button
                  href={href}
                  onClick={onClick}
                  label={t('suggestions.install')}
                  variant="primary"
                />
              )}
            </AppLinker>

            <Button
              variant="secondary"
              label={t('suggestions.silence')}
              onClick={silenceSuggestion}
              busy={isSilencing}
            />
          </>
        }
      />
    </CozyTheme>
  )
}

KonnectorSuggestionModal.propTypes = {
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

export default KonnectorSuggestionModal
