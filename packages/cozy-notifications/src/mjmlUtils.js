import mjml2html from 'mjml'

export const renderMJML = mjmlContent => {
  const obj = mjml2html(mjmlContent)
  obj.errors.forEach(err => {
    // eslint-disable-next-line no-console
    console.warn(err.formattedMessage)
  })

  if (obj.html) {
    return obj.html
  } else {
    throw new Error('Error during HTML generation')
  }
}
