/**
 * Returns true if path is Program or a Block
 *
 * @param  {PathNode} path
 * @return {Boolean}
 */
const isBlockLike = path => {
  return path.value && path.value.length !== undefined && path.name === 'body'
}

/**
 * Replaces `path.node` with `newNode` without keeping blocks, flattening
 * `newNode` into `path`. Useful when removing `if`/`else`.
 *
 * @param  {PathNode} path
 * @param  {Node} newNode
 */
const flatReplace = (path, newNode) => {
  if (
    newNode &&
    newNode.type === 'BlockStatement' &&
    isBlockLike(path.parentPath)
  ) {
    const node = path.parentPath.value.find(n => n === path.node)
    const index = path.parentPath.value.indexOf(node)
    path.parentPath.value.splice(index, 0, ...newNode.body)
    path.replace(null)
  } else {
    path.replace(newNode)
  }
}

/**
 * Statically evaluates boolean conditions
 *
 * @example
 *
 * `if (true) { foo } else { bar }` -> `foo`
 *
 * `true ? foo : bar` -> `foo`
 *
 * `!true ? foo : bar` -> `bar`
 *
 * @param  {NodePath} root
 * @param  {Object} j
 */
const simplifyConditions = (root, j) => {
  // Unary expressions with true/false
  for (let v of [true, false]) {
    root
      .find(j.UnaryExpression, {
        operator: '!',
        argument: { value: v }
      })
      .forEach(path => {
        path.replace(v ? j.literal(false) : j.literal(true))
      })
  }

  // Binary expressions with true/false
  for (let v of [true, false]) {
    for (let operator of ['&&', '||']) {
      for (let dir of ['left', 'right']) {
        const otherDir = dir === 'left' ? 'right' : 'left'
        const exps = root.find(j.LogicalExpression, {
          [dir]: { value: v },
          operator: operator
        })
        exps.forEach(exp => {
          if (operator == '&&') {
            exp.replace(v ? exp.node[otherDir] : exp.node[dir])
          } else {
            exp.replace(exp.node[otherDir])
          }
        })
      }
    }
  }

  // Simplify ternary conditions
  for (let v of [true, false]) {
    const conditionals = root.find(j.ConditionalExpression, {
      test: { value: v }
    })
    conditionals.forEach(conditional => {
      conditional.replace(
        v ? conditional.node.consequent : conditional.node.alternate
      )
    })
  }

  // Simplify ifs
  for (let v of [true, false]) {
    const ifs = root.find(j.IfStatement, { test: { value: v } })
    ifs.forEach(ifStatement => {
      flatReplace(
        ifStatement,
        v ? ifStatement.node.consequent : ifStatement.node.alternate
      )
    })
  }
}

export default simplifyConditions
