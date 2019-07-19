/**
 * Add an import to the start of a file.
 *
 * The first `specifier` will be the default import.
 *
 * `addImport(root, j, { source: 'react', specifiers: ['React', 'useState'] })`
 * will add `import React, { useState } from 'react'` to the file.
 */
const addImport = (root, j, options) => {
  const program = root.find(j.Program).get(0)
  program.node.body.unshift(
    0,
    j.importDeclaration(
      options.specifiers.map((imported, i) => {
        return j[i === 0 ? 'importDefaultSpecifier' : 'importSpecifier'](
          j.identifier(imported)
        )
      }),
      j.literal(options.source)
    )
  )
}

export default addImport
