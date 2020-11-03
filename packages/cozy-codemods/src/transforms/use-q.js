import importUtils from '../imports'

export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  const clientAllExpressions = root.find(j.CallExpression, {
    callee: { object: { name: 'client' }, property: { name: 'all' } }
  })

  clientAllExpressions.forEach(path => {
    path.node.callee = 'Q'
  })

  if (clientAllExpressions.length > 0) {
    importUtils.ensure(
      root,
      {
        Q: true
      },
      'cozy-client'
    )
  }

  return root.toSource()
}
