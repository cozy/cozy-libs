import React from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import dateFnsLocalefr from 'date-fns/locale/fr'
import dateFnsLocaleEn from 'date-fns/locale/en'
import dateFnsLocaleEs from 'date-fns/locale/es'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import UnlinkIcon from 'cozy-ui/transpiled/react/Icons/Unlink'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'

import { CollectionPropType } from './Contracts'
import { isDeleted, isDisabled, isErrored, isImported } from './helpers'

const dateFnsLocales = {
  en: dateFnsLocaleEn,
  fr: dateFnsLocalefr,
  es: dateFnsLocaleEs
}

const ContractItemSecondaryText = ({ contract }) => {
  const { t, f, lang } = useI18n()

  if (isDeleted(contract)) return t('contracts.deleted')
  if (isErrored(contract)) {
    return (
      <>
        <Icon icon={SyncIcon} size={8} color="#FE952A" />{' '}
        <span style={{ color: '#EFA82D' }}>
          {distanceInWordsToNow(contract.metadata.updatedAt, {
            addSuffix: true,
            locale: dateFnsLocales[lang]
          })}
        </span>
      </>
    )
  }
  if (isDisabled(contract)) {
    return (
      <>
        <Icon icon={UnlinkIcon} size={8} />{' '}
        {t('contracts.desynchronized.message', {
          date: f(
            new Date(contract.metadata.disabledAt),
            t('contracts.desynchronized.dateFormat')
          )
        })}
      </>
    )
  }
  if (isImported(contract)) {
    return (
      <>
        <Icon icon={SyncIcon} size={8} />{' '}
        {distanceInWordsToNow(contract.metadata.updatedAt, {
          addSuffix: true,
          locale: dateFnsLocales[lang]
        })}
      </>
    )
  }
  return null
}

ContractItemSecondaryText.propTypes = {
  contracts: PropTypes.oneOfType([CollectionPropType, PropTypes.array])
}

export default ContractItemSecondaryText
