const searchFlagCall = name => ({
  callee: { name: "flag" },
  arguments: [{ value: name }]
});

const removeRedundantExpressionContainers = (root, j) => {
  root.find(j.JSXExpressionContainer).forEach(path => {
  	if (path.parentPath.node.type == 'JSXElement' &&
       path.node.expression.type === 'JSXElement') {
      path.replace(path.node.expression)
    }
  })
}

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // replace flags by true
  removeRedundantExpressionContainers(root, j)

  return root.toSource();
}
