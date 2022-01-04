const strip = s => s.replace(/^[\s\n]+/g, '').replace(/[\s\n]+$/g, '')

const emptyTextNode = x => x.type === 'Literal' && strip(x.value).length === 0

module.exports = {
  emptyTextNode
}
