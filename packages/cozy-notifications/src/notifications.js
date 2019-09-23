import { renderer } from './templates'
import { renderMJML } from './mjml'

const result = (fn, defaultValue, ...args) => {
  if (fn && typeof fn === 'function') {
    return fn(...args)
  } else {
    return defaultValue
  }
}

const buildAttributes = async (notifView, options = {}) => {
  const templateData = await notifView.buildData()
  templateData.lang = options.lang

  const partials = result(notifView.getPartials, {})
  const helpers = result(notifView.getHelpers, {})

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
    content: notifView.toText(contentHTML),
    content_html: contentHTML
  }
}

export const sendNotification = async (cozyClient, notifView) => {
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

  const res = await cozyClient.fetchJSON('POST', '/notifications', {
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
