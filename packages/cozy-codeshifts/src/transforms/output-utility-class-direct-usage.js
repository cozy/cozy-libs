/**
 * Codemod used to output incorrect usage of global classes in cozy-ui.
 *
 * More info on https://github.com/cozy/cozy-ui/issues/1119
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  root.find(j.JSXAttribute, { name: { name: 'className' } }).forEach(path => {
    j(path)
      .find(j.Literal, {})
      .forEach(path => {
        if (
          path.node.value &&
          path.node.value.startsWith &&
          path.node.value.startsWith('u-') &&
          path.parentPath.node.type !== 'MemberExpression'
        ) {
          console.log(
            `${file.path}:${path.node.loc.start.line}`,
            `${
              path.node.value
            } seems to be use directly, use it through a style import otherwise it cannot be included in stylesheet.css`
          )
        }
      })
  })

  return root.toSource()
}
