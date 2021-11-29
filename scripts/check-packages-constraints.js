/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

const readJsonSync = filename => {
  return JSON.parse(fs.readFileSync(filename).toString())
}

/* Ensures dependencies are updated for the all workspaces */
const uniqueVersion = function () {
  const store = {}
  return function* ({ pkgName, pkgVersion }) {
    if (store[pkgName]) {
      if (pkgVersion != store[pkgName]) {
        yield {
          level: 'warn',
          message: `Two different versions of ${pkgName}; ${store[pkgName]} != ${pkgVersion}`
        }
      }
    } else {
      store[pkgName] = pkgVersion
    }
  }
}

/* Ensures we install dependencies at the right place */
const depKeyIs = depKeyOpt =>
  function* ({ pkgName, depKey }) {
    if (typeof depKeyOpt === 'string' && depKey !== depKeyOpt) {
      yield {
        level: 'warn',
        message: `${pkgName} should not be in ${depKey}`
      }
    }
    if (typeof depKeyOpt == 'object' && depKeyOpt.length) {
      if (depKeyOpt.indexOf(depKey) === -1) {
        yield {
          level: 'warn',
          message: `${pkgName} should be either ${depKeyOpt.join(' or ')}`
        }
      }
    }
  }

/* Disallow a package */
const shouldNotBeUsed = () =>
  function* ({ pkgName }) {
    yield { level: 'warn', message: `${pkgName} should not be used` }
  }

const isBabelDevPackage = dep => {
  return (
    (dep.startsWith('@babel') || dep.startsWith('babel')) &&
    dep !== '@babel/runtime'
  )
}

const isPkg = pkgName => pkgName2 => pkgName === pkgName2

const any = () => true

const versionAt = versionOpt =>
  function* ({ pkgName, pkgVersion }) {
    if (pkgVersion !== versionOpt) {
      yield {
        level: 'warn',
        message: `${pkgName} should be at version ${versionOpt} (it is at ${pkgVersion})`
      }
    }
  }

/* Ensures a dep is installed with another dep */
const hasOtherDep = (pkgName, depKey, message) =>
  function* ({ pkgName, depKey, pkgJson }) {
    if (!pkgJson[depKey] || !pkgJson[depKey][pkgName]) {
      yield {
        level: 'warn',
        message
      }
    }
  }

const isStrict = version =>
  Boolean(/^[0-9]/.exec(version)) && version.split('.').length === 3

const peerDepHasLenientVersion = () =>
  function* ({ depKey, pkgName, pkgVersion }) {
    if (depKey !== 'peerDependencies') {
      return
    }
    if (isStrict(pkgVersion)) {
      yield {
        level: 'warn',
        message: `Incorrect version ${pkgName}@${pkgVersion} : peer deps should have lenient version`
      }
    }
  }

const constraints = [
  [isBabelDevPackage, [uniqueVersion(), depKeyIs('devDependencies')]],
  [isPkg('react-markdown'), [shouldNotBeUsed()]],
  [isPkg('@babel/runtime'), [uniqueVersion(), depKeyIs('peerDependencies')]],
  [
    isPkg('jest'),
    [
      uniqueVersion(),
      versionAt('26.2.2'),
      depKeyIs('devDependencies'),
      hasOtherDep(
        'babel-jest',
        'devDependencies',
        'babel-jest must be installed along jest'
      )
    ]
  ],
  [any, [peerDepHasLenientVersion()]],
  [isPkg('cozy-client'), [depKeyIs(['peerDependencies', 'devDependencies'])]],
  [isPkg('cozy-ui'), [depKeyIs(['peerDependencies', 'devDependencies'])]],
  [isPkg('cozy-realtime'), [depKeyIs(['peerDependencies', 'devDependencies'])]],
  [isPkg('@testing-library/react'), [uniqueVersion()]],
  [isPkg('babel-core'), [shouldNotBeUsed()]]
]

/* Reads all the package.json and log warnings when constraints are not met */
const main = async () => {
  const packages = fs.readdirSync('packages')
  for (let pkgName of packages) {
    const pkgJson = readJsonSync(path.join('packages', pkgName, 'package.json'))
    if (!pkgJson.devDependencies) {
      continue
    }
    if (pkgJson.private) {
      continue
    }
    for (let depKey of [
      'dependencies',
      'devDependencies',
      'peerDependencies'
    ]) {
      if (!pkgJson[depKey]) {
        continue
      }
      const deps = Object.keys(pkgJson[depKey])
      for (let dep of deps) {
        for (let [pred, checks] of constraints) {
          if (!pred(dep)) {
            continue
          }
          for (let c of checks) {
            const results = Array.from(
              c({
                pkgName: dep,
                pkgVersion: pkgJson[depKey][dep],
                depKey,
                pkgJson
              })
            )
            for (let result of results) {
              console.log(`[${result.level}] ${pkgName}: ${result.message}`)
            }
          }
        }
      }
    }
  }
}

if (require.main === module) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
