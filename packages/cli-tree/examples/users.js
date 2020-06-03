/* eslint-disable no-console */

const { build, completionHandler } = require('../src')

const removeUsers = args => {
  console.log('Remove users', args)
}
const listUsers = args => {
  console.log('List users', args)
}

const main = async () => {
  const commands = {
    users: {
      list: {
        description: 'List users',
        arguments: [
          // The option apart from "argument" are the ones of argparse
          {
            argument: '--deleted',
            action: 'storeTrue',
            help: 'Show also deleted users'
          }
        ],
        handler: listUsers
      },

      remove: {
        description: 'Remove all users',
        handler: removeUsers
      }
    }
  }
  // parser is an argparse parser
  await completionHandler(commands)
  const [parser] = build(commands)

  // You can further customize parser here
  const args = parser.parseArgs()
  args.handle(args)
}

if (require.main === module) {
  main()
}
