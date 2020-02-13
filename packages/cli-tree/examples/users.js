const { build } = require('../src')

const removeUsers = args => {
  console.log('Remove users', args)
}
const listUsers = args => {
  console.log('List users', args)
}

const main = () => {
  // parser is an argparse parser
  const [parser] = build({
    users: {
      list: {
        description: 'List users',
        arguments: [
          // The option apart from "argument" are the ones of argparse
          { argument: '--deleted', action: 'storeTrue', help: 'Show also deleted users' }
        ],
        handler: listUsers
      },

      remove: {
        description: 'Remove all users',
        handler: removeUsers
      }
    }
  })

  // You can further customize parser here
  const args = parser.parseArgs()
  args.handle(args)
}

if (require.main === module) {
  main()
}
