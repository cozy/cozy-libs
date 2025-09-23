import Polyglot from 'node-polyglot'

const polyglots = {}
const langs = ['fr', 'en', 'ru', 'vi']
for (const lang of langs) {
  let locales = {}
  try {
    locales = require(`./${lang}.json`)
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const polyglot = new Polyglot()
  polyglot.extend(locales)
  polyglots[lang] = polyglot
}

const getBoundT = lang => {
  const polyglot = polyglots[lang] || polyglots['en']
  return polyglot.t.bind(polyglot)
}

export { getBoundT }
