/**
 * Removes falsy JSX containers
 * JSX identifiers are counted as React usage.
 *
 * @example
 * <div>{false}</div> -> <div></div>
 *
 * @param  {PathNode} root
 * @param  {Object} j
 */
export default (root, j) => {
  // Remove empty declarations
  root
    .find(j.JSXExpressionContainer, {
      expression: { type: 'Literal', value: false }
    })
    .forEach(p => {
      if (p.parentPath.node.type === 'JSXAttribute') {
        return
      }
      p.replace(null)
    })
}
