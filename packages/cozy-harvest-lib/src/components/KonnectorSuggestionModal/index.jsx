import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'
import get from 'lodash/get'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import ExperimentalModal from 'cozy-ui/transpiled/react/Labs/ExperimentalModal'
import AppLinker, { generateWebLink } from 'cozy-ui/transpiled/react/AppLinker'
import { Button, ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { Title, Caption } from 'cozy-ui/transpiled/react/Text'

import Illustration from './Illustration'
import DataTypes from './DataTypes'

const KonnectorSuggestionModal = ({
  t,
  client,
  konnectorAppSuggestion,
  konnectorManifest,
  closeModal
}) => {
  const { slug } = konnectorAppSuggestion
  const cozyURL = new URL(client.getStackClient().uri)
  const storeAppName = 'store'
  const nativePath = `/discover/${slug}`
  const { cozySubdomainType: subDomainType } = client.getInstanceOptions()
  const [isSilencing, setIsSilencing] = useState(false)

  const dataTypes = get(konnectorManifest, 'data_types', [])
  const name = get(konnectorManifest, 'name', slug)
  const reason = get(konnectorAppSuggestion, 'reason.code')

  const silenceSuggestion = async () => {
    setIsSilencing(true)
    await client.save({ ...konnectorAppSuggestion, silenced: true })
    setIsSilencing(false)
    closeModal()
  }

  return (
    <ExperimentalModal
      description={
        <div className="u-flex u-flex-column u-flex-items-center">
          <Illustration
            alt={t('suggestions.illustration')}
            iconAlt={t('app.logo.alt', { name })}
            app={slug}
          />
          <Title className="u-mb-half">
            {t('suggestions.title', { name })}
          </Title>
          <DataTypes dataTypes={dataTypes} konnectorName={name} />
        </div>
      }
      descriptionFooter={
        <>
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
        </>
      }
    />
  )
}

KonnectorSuggestionModal.propTypes = {
  t: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  konnectorAppSuggestion: PropTypes.shape({
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
  closeModal: PropTypes.func.isRequired
}

export default withClient(translate()(KonnectorSuggestionModal))
