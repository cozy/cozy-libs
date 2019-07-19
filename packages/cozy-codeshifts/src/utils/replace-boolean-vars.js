const removeEmptyDeclarations = (root, j) => {
  // Remove empty declarations
  root.find(j.VariableDeclaration).forEach(p => {
    if (p.node.declarations.filter(Boolean).length === 0) {
      p.replace(null)
    }
  })
}

const replaceBooleanVars = (root, j) => {
  for (let booleanValue of [true, false]) {
    root
      .find(j.VariableDeclarator, { init: { value: booleanValue } })
      .forEach(path => {
        const assignment = path.parentPath.node
        if (assignment.kind !== 'const') {
          return
        }
        const identifierName = path.node.id.name
        j(path)
          .closestScope()
          .find(j.Identifier, { name: identifierName })
          .forEach(path => {
            const parentType = path.parentPath.node.type
            const isDeclarationOrAssignment =
              parentType === 'AssignmentExpression' ||
              parentType === 'VariableDeclaration' ||
              parentType === 'MemberExpression'
            if (isDeclarationOrAssignment) {
              return
            }
            path.replace(j.literal(booleanValue))
          })
        path.replace(null)
      })
    removeEmptyDeclarations(root, j)
  }
}

export default replaceBooleanVars
