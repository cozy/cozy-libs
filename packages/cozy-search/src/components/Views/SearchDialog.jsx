import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import { locales } from '../../locales'
import AssistantProvider from '../AssistantProvider'
import ResultMenuContent from '../ResultMenu/ResultMenuContent'
import SearchBar from '../Search/SearchBar'
import { useSearch } from '../Search/SearchProvider'
import SearchProvider from '../Search/SearchProvider'

const SearchDialog = () => {
  useExtendI18n(locales)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { searchValue } = useSearch()

  const onClose = () => {
    try {
      const returnPath = searchParams.get('returnPath')
      if (returnPath) {
        navigate(returnPath)
      } else {
        navigate('..')
      }
    } catch {
      navigate('..')
    }
  }
  return (
    <FixedDialog
      open
      fullScreen
      size="full"
      disableGutters
      componentsProps={{
        // don't touch padding-top in dialogTitle, there is a flagship override. Play with margin instead.
        dialogTitle: { className: 'u-ph-half u-pb-0 u-mt-2-half u-ov-visible' },
        divider: { className: 'u-dn' }
      }}
      title={<SearchBar />}
      content={searchValue && <ResultMenuContent />}
      onClose={onClose}
    />
  )
}

const SearchDialogWithProviders = () => {
  return (
    <CozyTheme variant="normal">
      <AssistantProvider>
        <SearchProvider>
          <SearchDialog />
        </SearchProvider>
      </AssistantProvider>
    </CozyTheme>
  )
}

export default SearchDialogWithProviders
