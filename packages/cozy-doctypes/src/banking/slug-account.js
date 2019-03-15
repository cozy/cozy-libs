const labelSlugs = require('./label-slugs')

const institutionLabelsCompiled = Object.entries(labelSlugs).map(
  ([ilabelRx, slug]) => {
    if (ilabelRx[0] === '/' && ilabelRx[ilabelRx.length - 1] === '/') {
      return [new RegExp(ilabelRx.substr(1, ilabelRx.length - 2), 'i'), slug]
    } else {
      return [ilabelRx, slug]
    }
  }
)

const getSlugFromInstitutionLabel = institutionLabel => {
  if (!institutionLabel) {
    return
  }
  for (const [rx, slug] of institutionLabelsCompiled) {
    if (rx instanceof RegExp) {
      const match = institutionLabel.match(rx)
      if (match) {
        return slug
      }
    } else if (rx.toLowerCase() === institutionLabel.toLowerCase()) {
      return slug
    }
  }
}

module.exports = {
  getSlugFromInstitutionLabel
}
