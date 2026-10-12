/**
 * Provides an I18n helper using a Higher Order Component.
 */

'use strict'

import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'

import { initFormat } from './format'
import { initTranslation } from './translation'

export const DEFAULT_LANG = 'en'

export const I18nContext = React.createContext()

export const i18nPropTypes = {
  t: PropTypes.func,
  f: PropTypes.func,
  polyglot: PropTypes.object,
  lang: PropTypes.string
}

/**
 * @typedef useI18nReturnTypes
 * @property {(key: string, options?: number | Record<string, unknown>) => string} t
 * @property {(date: string | number | Date, format: string, options?: Record<string, unknown>) => string} f
 * @property {string} lang
 */

/**
 * @returns {useI18nReturnTypes}
 */
export const useI18n = () => {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error(
      '`I18nContext` is missing. `useI18n()` must be used within a `<I18n>`'
    )
  }

  return context
}

/**
 * Provider root component
 *
 * @returns {React.ReactElement}
 */
const I18n = ({
  lang,
  polyglot,
  dictRequire,
  context,
  defaultLang = DEFAULT_LANG,
  children
}) => {
  const init = () => {
    const translator =
      polyglot || initTranslation(lang, dictRequire, context, defaultLang)

    return {
      t: translator.t.bind(translator),
      f: initFormat(lang, defaultLang),
      polyglot: translator,
      lang
    }
  }

  const [contextValue, setContextValue] = useState(init)

  if (contextValue.lang !== lang) {
    setContextValue(init())
  }

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  )
}

I18n.propTypes = {
  lang: PropTypes.string.isRequired, // current language.
  polyglot: PropTypes.object, // A polyglot instance.
  dictRequire: PropTypes.func, // A callback to load locales.
  context: PropTypes.string, // current context.
  defaultLang: PropTypes.string // default language. By default is 'en'
}

export default I18n
