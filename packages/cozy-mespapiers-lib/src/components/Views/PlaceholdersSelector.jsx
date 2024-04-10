import React, { useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

import { useClient, Q } from 'cozy-client'
import { isInstalled } from 'cozy-client/dist/models/applications'
import { useWebviewIntent } from 'cozy-intent'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NestedSelectResponsive from 'cozy-ui/transpiled/react/NestedSelect/NestedSelectResponsive'
import PointerAlert from 'cozy-ui/transpiled/react/PointerAlert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { buildURLSearchParamsForInstallKonnectorFromIntent } from './helpers'
import { APPS_DOCTYPE } from '../../doctypes'
import { findPlaceholdersByQualification } from '../../helpers/findPlaceholders'
import { getThemesList } from '../../helpers/themes'
import { usePapersCreated } from '../Contexts/PapersCreatedProvider'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import FileIcon from '../Icons/FileIcon'
import { KonnectorIcon } from '../Icons/KonnectorIcon'
import { isReminder } from '../Placeholders/helpers'

const PlaceholdersSelector = () => {
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()
  const navigate = useNavigate()
  const scannerT = useScannerI18n()
  const [searchParams] = useSearchParams()
  const themesList = getThemesList()
  const { papersDefinitions } = usePapersDefinitions()
  const client = useClient()
  const { pathname } = useLocation()
  const { countPaperCreatedByMesPapiers } = usePapersCreated()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')

  const options = useMemo(
    () => ({
      header: countPaperCreatedByMesPapiers === 0 && (
        <PointerAlert className="u-mh-1 u-mt-1 u-ta-center" icon={false}>
          {t('PlaceholdersList.header')}
        </PointerAlert>
      ),
      childrenHeader: level =>
        level === 1 &&
        countPaperCreatedByMesPapiers === 0 && (
          <PointerAlert className="u-mh-1 u-mt-1" icon={false}>
            {t('PlaceholdersList.childrenHeader')}
          </PointerAlert>
        ),
      children: themesList.map((theme, index) => {
        const allPlaceholders = findPlaceholdersByQualification(
          papersDefinitions,
          theme.items
        )

        return {
          id: index,
          title: scannerT(`themes.${theme.label}`),
          icon: <FileIcon icon={theme.icon} />,
          children: allPlaceholders.map((placeholder, index) => {
            return {
              id: index,
              key: index,
              placeholder,
              title: scannerT(`items.${placeholder.label}`, {
                country: placeholder.country
              }),
              icon: isReminder(placeholder) ? (
                <Icon icon={placeholder.icon} size={64} />
              ) : (
                <FileIcon icon={placeholder.icon} />
              ),
              children: (() => {
                if (!fromFlagshipUpload && placeholder.konnectorCriteria) {
                  return [
                    {
                      title: t('ImportDropdown.importAuto.title'),
                      description: t('ImportDropdown.importAuto.text'),
                      icon: (
                        <KonnectorIcon
                          konnectorCriteria={placeholder.konnectorCriteria}
                          size={24}
                        />
                      ),
                      isKonnectorAutoImport: true,
                      placeholder
                    },
                    {
                      title: t('ImportDropdown.scanPicture.title'),
                      description: t('ImportDropdown.scanPicture.text'),
                      icon: <Icon icon="camera" size={16} />,
                      placeholder
                    }
                  ]
                }
                return undefined
              })()
            }
          })
        }
      })
    }),
    [
      countPaperCreatedByMesPapiers,
      fromFlagshipUpload,
      papersDefinitions,
      scannerT,
      t,
      themesList
    ]
  )

  const redirectPaperCreation = async placeholder => {
    !!placeholder.country && searchParams.set('country', placeholder.country)
    !!fromFlagshipUpload &&
      searchParams.set('fromFlagshipUpload', fromFlagshipUpload)

    if (isReminder(placeholder)) {
      const { data: apps } = await client.query(Q(APPS_DOCTYPE))
      const isNoteAppInstalled = !!isInstalled(apps, { slug: 'notes' })

      if (!isNoteAppInstalled) {
        return navigate({
          pathname: '../installAppIntent',
          search: `redirect=${pathname}/${placeholder.label}`
        })
      }
    }

    return navigate({
      pathname: `${pathname}/${placeholder.label}`,
      search: searchParams.toString()
    })
  }

  const handleClick = async ({ placeholder, isKonnectorAutoImport }) => {
    if (!isKonnectorAutoImport) {
      return redirectPaperCreation(placeholder)
    }

    const searchParams = buildURLSearchParamsForInstallKonnectorFromIntent(
      placeholder.konnectorCriteria,
      placeholder.label
    )
    const normalizePathname = pathname.split('/create')[0]

    navigate({
      pathname: `${normalizePathname}/installKonnectorIntent`,
      search: `${searchParams}`
    })
  }

  const handleClose = async () => {
    fromFlagshipUpload
      ? await webviewIntent?.call('cancelUploadByCozyApp')
      : navigate('..')
  }

  return (
    <>
      <NestedSelectResponsive
        title={t('PlaceholdersList.title', { name: '' })}
        options={options}
        noDivider
        ellipsis={false}
        isSelected={() => false}
        onSelect={option => handleClick(option)}
        onClose={handleClose}
      />
    </>
  )
}

export default PlaceholdersSelector
