const cheerio = require('cheerio')

const getContentDefault = $ => {
  const beforeContent = $('.before-content').get(0)
  let sibling = beforeContent.nextSibling

  let content = ''
  while (sibling) {
    const text = $(sibling)
      .text()
      .split('\n')
      .map(x => x.trim())
      .filter(Boolean)
      .join('')
    if (text) {
      content = content + '\n\n' + text
    }
    sibling = sibling.nextSibling
  }

  return content
}

export const toText = (cozyHTMLEmail, getContent) => {
  getContent = getContent || getContentDefault

  const $ = cheerio.load(cozyHTMLEmail)
  const title = $('.header__title')
    .text()
    .trim()
  const descTitle = $('.header__desc__title')
    .text()
    .trim()
  const descSubtitle = $('.header__desc__subtitle')
    .text()
    .trim()
  return `
# Cozy - ${title}
## ${descTitle} - ${descSubtitle}

---------
${getContent($)}
`
}
