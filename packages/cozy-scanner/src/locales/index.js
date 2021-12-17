import Polyglot from 'node-polyglot'

const polyglots = {}
const langs = ['fr', 'en']
for (const lang of langs) {
  let locales = {}
  try {
    locales = require(`./${lang}.json`)
  } catch (e) {
    // eslint-disable-line no-empty-block
  }
  const polyglot = new Polyglot()
  polyglot.extend(locales)
  polyglots[lang] = polyglot
}

const getBoundT = lang => {
  const polyglot = polyglots[lang] || polyglots['en']
  return polyglot.t.bind(polyglot)
}

export { getBoundT }
