/**
 * Remove redundant expression containers.
 *
 * @example
 * <div>{<div></div>}</div> -> <div><div></div></div>
 *
 * @param  {PathNode} root
 * @param  {Object} j
 * @return
 */
const removeRedundantExpressionContainers = (root, j) => {
  root.find(j.JSXExpressionContainer).forEach(path => {
    if (
      path.parentPath.node.type == 'JSXElement' &&
      path.node.expression.type === 'JSXElement'
    ) {
      path.replace(path.node.expression)
    }
  })
}

export default removeRedundantExpressionContainers
