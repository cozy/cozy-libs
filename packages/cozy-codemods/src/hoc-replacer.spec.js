const hocReplacer = require('./hoc-replacer')

const examples = {
  client: {
    before: `
import { withClient } from 'cozy-client'

const Component1 = withClient(({ client }) => {
  return <div>Component 1</div>
})

const Component2 = ({ client }) => {
  return <div>Component 2</div>
}

export default withClient(Component2)
`,
    after: `
import { useClient } from 'cozy-client'

const Component1 = () => {
  const client = useClient()
  return <div>Component 1</div>
}

const Component2 = () => {
  const client = useClient()
  return <div>Component 2</div>
}

export default Component2;
`
  },
  breakpoints: {
    before: `
import { withBreakpoints } from 'cozy-ui/transpiled/react'

const Component1 = withBreakpoints()(({ breakpoints: { isMobile } }) => {
  return <div>Component 1</div>
})

const Component2 = ({ breakpoints: { isDesktop } }) => {
  return <div>Component 2</div>
}

export default compose(withBreakpoints(), otherHoc)(Component2)
`,
    after: `
import { useBreakpoints } from 'cozy-ui/transpiled/react'

const Component1 = () => {
  const { isMobile } = useBreakpoints()
  return <div>Component 1</div>
}

const Component2 = () => {
  const { isDesktop } = useBreakpoints()
  return <div>Component 2</div>
}

export default otherHoc(Component2)
`
  }
}

const j = require('jscodeshift')

const isClientProp = prop => {
  return prop.key && prop.key.name === 'client'
}

const findClientProps = objPattern => {
  if (!objPattern) {
    return
  }
  if (objPattern.type !== 'ObjectPattern') {
    return
  }
  return objPattern.properties
    ? objPattern.properties.filter(isClientProp).map(prop => prop.key.name)
    : []
}

const isBreakpointProp = prop => {
  return prop.key && prop.key.name === 'breakpoints'
}

const findBreakpointsProp = objPattern => {
  if (!objPattern) {
    return
  }
  if (objPattern.type !== 'ObjectPattern') {
    return
  }

  return objPattern.properties
    ? objPattern.properties.filter(isBreakpointProp).map(prop => prop)
    : []
}

describe('HOC replacer', () => {
  it('should replace an HOC by a hook (HOC takes no option = simpleHOC)', () => {
    const replaceClientPropsByHook = hocReplacer({
      propsFilter: isClientProp,
      propsFinder: findClientProps,
      hookUsage: `const client = useClient()`,
      hocName: 'withClient',
      j,
      noOptionsHOC: true,
      importOptions: {
        specifiers: {
          useClient: true
        },
        package: 'cozy-client',
        filter: importNode => importNode.source.value == 'cozy-client'
      }
    })
    const root = j(examples.client.before)
    replaceClientPropsByHook(root)
    expect(root.toSource()).toEqual(examples.client.after)
  })

  it('should replace an HOC by a hook (HOC takes options)', () => {
    const replaceBreakpointsHOC = hocReplacer({
      propsFilter: isBreakpointProp,
      propsFinder: findBreakpointsProp,
      hookUsage: foundProps => {
        return `const ${foundProps
          .map(p => j(p.value).toSource())
          .join(', ')} = useBreakpoints()`
      },
      hocName: 'withBreakpoints',
      j,
      noOptionsHOC: false,
      importOptions: {
        filter: x => {
          return (
            x.source.value == 'cozy-ui/transpiled/react' ||
            x.source.value == 'cozy-ui/react'
          )
        },
        specifiers: {
          useBreakpoints: true
        },
        package: 'cozy-ui/transpiled/react'
      }
    })
    const root = j(examples.breakpoints.before)
    replaceBreakpointsHOC(root)
    expect(root.toSource()).toEqual(examples.breakpoints.after)
  })
})
