import { imports } from '..'

export default function transformMuiStylesImports(file, api) {
  var j = api.jscodeshift
  const root = j(file.source)

  imports.simplify(root, {
    imports: {
      makeStyles: {
        importPath: 'cozy-ui/transpiled/react/styles',
        defaultImport: false
      },
      useTheme: {
        importPath: 'cozy-ui/transpiled/react/styles',
        defaultImport: false
      },
      withStyles: {
        importPath: 'cozy-ui/transpiled/react/styles',
        defaultImport: false
      }
    }
  })

  return root.toSource()
}
