const argparse = require('argparse')
const merge = require('lodash/merge')
const omit = require('lodash/omit')

const {
  getCompletionSetupCommands,
  completionHandler
} = require('./completion')

const visit = (tree, fn, path = []) => {
  for (let [k, v] of Object.entries(tree)) {
    const newPath = path.slice()
    newPath.push(k)
    fn(v, newPath)
    if (typeof v === 'object') {
      visit(v, fn, newPath)
    }
  }
}

const build = (cliTree, options = {}) => {
  const parser = new argparse.ArgumentParser()
  const completionSetupCommands = getCompletionSetupCommands(parser)
  const rootParser = parser
  const subparsers = parser.addSubparsers()

  const parserByPath = {}
  const getParserAtPath = (path, parserDef) => {
    if (path.length == 0) {
      return [rootParser, subparsers]
    }
    const strPath = path.join('.')
    if (parserByPath[strPath]) {
      return parserByPath[strPath]
    } else {
      const [, parentSubparsers] = getParserAtPath(path.slice(0, -1), true)
      const subcommand = path[path.length - 1]
      const parser = parentSubparsers.addParser(subcommand, {
        addHelp: true,
        help: parserDef.help || parserDef.description,
        description: parserDef.description
      })

      // Do not add subparsers if we are at a leaf
      const subparsers = parserDef.handler
        ? null
        : parser.addSubparsers({ showHelp: true })
      parserByPath[strPath] = [parser, subparsers]
      return [parser, subparsers]
    }
  }
  visit(Object.assign(cliTree, completionSetupCommands), (node, path) => {
    if (typeof node !== 'object') {
      return
    }
    if (node.handler) {
      const [parser] = getParserAtPath(path, node)
      parser.setDefaults({ handler: node.handler })
      if (node.arguments) {
        for (let argOpt of node.arguments) {
          const arg = typeof argOpt === 'string' ? argOpt : argOpt.argument
          const argumentOptions =
            typeof argOpt === 'string' ? {} : omit(argOpt, 'argument')
          const argOptions = merge(
            { help: options.helps && options.helps[arg] },
            argumentOptions
          )
          parser.addArgument(arg, argOptions)
        }
      }
    }
  })

  return [parser, subparsers]
}

module.exports = {
  build,
  completionHandler
}
