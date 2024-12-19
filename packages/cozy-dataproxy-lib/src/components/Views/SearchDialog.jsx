import React from 'react'
import { useNavigate } from 'react-router-dom'

import flag from 'cozy-flags'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import localesEn from '../../locales/en.json'
import localesFr from '../../locales/fr.json'
import AssistantProvider, { useAssistant } from '../AssistantProvider'
import ResultMenuContent from '../ResultMenu/ResultMenuContent'
import SearchBar from '../Search/SearchBar'
import { useSearch } from '../Search/SearchProvider'
import SearchProvider from '../Search/SearchProvider'
import SearchSubmitFab from '../Search/SearchSubmitFab'
import { makeConversationId } from '../helpers'

const locales = { fr: localesFr, en: localesEn }

const SearchDialog = () => {
  useExtendI18n(locales)
  const { onAssistantExecute } = useAssistant()
  const navigate = useNavigate()
  const { searchValue } = useSearch()

  const handleClick = () => {
    const conversationId = makeConversationId()
    onAssistantExecute({ value: searchValue, conversationId })
    navigate(`../assistant/${conversationId}`, { replace: true })
  }

  const handleClose = () => {
    navigate('..')
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
      content={
        <>
          {searchValue && <ResultMenuContent onClick={handleClick} />}
          {flag('cozy.assistant.enabled') && (
            <SearchSubmitFab searchValue={searchValue} onClick={handleClick} />
          )}
        </>
      }
      onClose={handleClose}
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