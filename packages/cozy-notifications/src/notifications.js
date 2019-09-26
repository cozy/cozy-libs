import { renderer } from './templates'
import { renderMJML } from './mjml'
import { generateUniversalLink, generateWebLink } from './urls'
import get from 'lodash/get'
import enLocale from './locales/en.json'
import frLocale from './locales/fr.json'

const builtInLocales = {
  en: enLocale,
  fr: frLocale
}

const result = (fn, defaultValue, ...args) => {
  if (fn && typeof fn === 'function') {
    return fn(...args)
  } else {
    return defaultValue
  }
}

const getBuiltInHelpersForView = notifView => {
  const linkHelperOptions = {
    cozyUrl: notifView.client.stackClient.uri
  }
  return {
    t: (key, hOpts) => notifView.t(key, hOpts.hash),
    tGlobal: key => {
      const locale = builtInLocales[notifView.lang]
      return get(locale, key)
    },
    universalLink: hOpts => {
      return generateUniversalLink({ ...hOpts.hash, ...linkHelperOptions })
    },
    webLink: hOpts => {
      return generateWebLink({ ...hOpts.hash, ...linkHelperOptions })
    }
  }
}

const buildAttributes = async (notifView, options = {}) => {
  const templateData = await notifView.buildData()
  templateData.lang = options.lang

  const partials = result(notifView.getPartials, {})

  const helpers = {
    ...result(notifView.getHelpers, {}),
    ...getBuiltInHelpersForView(notifView)
  }

  const { render } = renderer({
    partials,
    helpers
  })

  const { full } = render({
    template: notifView.constructor.template,
    data: templateData
  })

  const contentHTML = renderMJML(full)

  const pushContent = result(notifView.getPushContent, null, templateData)

  return {
    category: notifView.constructor.category,
    title: notifView.getTitle(templateData),
    message: pushContent,
    preferred_channels: notifView.constructor.preferredChannels,
    content_html: contentHTML
    content: notifView.constructor.toText(contentHTML),
  }
}

export const sendNotification = async (cozyClient, notifView) => {
  if (!cozyClient.stackClient.uri) {
    throw new Error('stack client without uri')
  }
  if (notifView.prepare) {
    await notifView.prepare()
  }

  if (notifView.shouldSend && !notifView.shouldSend()) {
    return
  }

  const attributes = await buildAttributes(notifView)
  if (notifView.getExtraAttributes) {
    Object.assign(attributes, notifView.getExtraAttributes())
  }

  const res = await cozyClient.stackClient.fetchJSON('POST', '/notifications', {
    data: {
      type: 'io.cozy.notifications',
      attributes
    }
  })

  if (notifView.onSuccess) {
    await notifView.onSuccess(attributes, res)
  }

  return res
}
