import { build } from '@cozy/cli-tree'
import minilog from '@cozy/minilog'
import { createClientInteractive } from 'cozy-client/dist/cli'

import './polyfill'
import { multiPrompt } from './prompt'
import assert from '../assert'
import logger from '../logger'
import ConnectionFlow, {
  ERROR_EVENT,
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
  TWO_FA_REQUEST_EVENT,
  UPDATE_EVENT
} from '../models/ConnectionFlow'

minilog.enable()

const KONNECTOR_DOCTYPE = 'io.cozy.konnectors'
const ACCOUNT_DOCTYPE = 'io.cozy.accounts'
const TRIGGER_DOCTYPE = 'io.cozy.triggers'
const PERMISSION_DOCTYPE = 'io.cozy.permissions'
const JOB_DOCTYPE = 'io.cozy.jobs'

const logChanges = (a, b) => {
  const allKeys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]))
  for (const k of allKeys) {
    if (b[k] !== a[k]) {
      logger.debug(`${k} changed to: ${b[k]} (prev ${a[k]})`)
    }
  }
}
const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
const wait = (obs, ev) =>
  new Promise(resolve => {
    obs.once(ev, () => resolve(ev))
  })

const fetchAccount = async (client, accountId) => {
  const { data: account } = await client
    .collection(ACCOUNT_DOCTYPE)
    .get(accountId)
  return account
}

const fakeVault = {
  isLocked: () => Promise.resolve(true)
}

const logDebug =
  name =>
  (...args) =>
    logger.debug('Connection flow emitted', name, ...args)

const exitOnError = fn =>
  async function () {
    try {
      const res = await fn.apply(this, arguments)
      return res
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  }

const createOrUpdateMain = async (args, client) => {
  const {
    data: { attributes: konnector }
  } = await client.collection(KONNECTOR_DOCTYPE).get(args.konnector)

  konnector._type = 'io.cozy.konnectors'
  const flow = new ConnectionFlow(client)

  const handleTwoFARequest = exitOnError(async () => {
    await sleep(300)

    const fields = flow.getAdditionalInformationNeeded()

    let responses
    if (fields.length > 0) {
      responses = await multiPrompt(fields)
    } else {
      await prompt('Type [enter] to resume decoupled connection')
      responses = {}
    }
    flow.sendAdditionalInformation(responses)
  })

  let lastState = flow.getState()
  flow
    .on(ERROR_EVENT, logDebug('ERROR_EVENT'))
    .on(SUCCESS_EVENT, logDebug('SUCCESS_EVENT'))
    .on(LOGIN_SUCCESS_EVENT, logDebug('LOGIN_SUCCESS_EVENT'))
    .on(TWO_FA_REQUEST_EVENT, handleTwoFARequest)
    .on(UPDATE_EVENT, () => {
      const newState = flow.getState()
      logChanges(lastState, newState)
      lastState = newState
    })

  const account = args.account ? await fetchAccount(client, args.account) : null

  if (args.account) {
    assert(account, `Could not find account ${args.account}`)
  }

  logger.info(`${args.account ? 'Updating' : 'Creating'} account`)

  const prom = flow.handleFormSubmit({
    konnector,
    vaultClient: fakeVault,
    cipherId: null,
    trigger: null,
    account,
    userCredentials: args.fields
  })

  const rejectedProm = new Promise((resolve, reject) => prom.catch(reject))

  const finalEvents = [
    ERROR_EVENT,
    SUCCESS_EVENT,
    args.waitCompletion ? null : LOGIN_SUCCESS_EVENT
  ].filter(Boolean)

  logger.debug('Waiting on events', finalEvents)
  const ev = await Promise.race(
    finalEvents.map(ev => wait(flow, ev)).concat([rejectedProm])
  )
  logger.info('Finished waiting because', ev)

  await sleep(1000)
  logger('After save')
}

const parseArgs = () => {
  const verbosityArg = {
    argument: '-v',
    action: 'count',
    default: 0,
    dest: 'verbosity'
  }
  const [parser] = build({
    sendForm: {
      description:
        'Executes connection creation flow (create account, trigger, launch trigger)',
      arguments: [
        { argument: '--konnector', required: true },
        { argument: '--field', dest: 'fieldList', action: 'append' },
        { argument: '--account' },
        { argument: '--waitCompletion', action: 'storeTrue' },
        verbosityArg
      ],
      handler: createOrUpdateMain
    }
  })

  const args = parser.parseArgs()
  args.fields = args.fieldList.reduce((acc, item) => {
    const [name, value] = item.split(':')
    acc[name] = value
    assert(
      name && value,
      `Field must be in the form field_name:field_value (you passed ${item})`
    )
    return acc
  }, {})

  assert(args.fields.login, 'No login passed, --field login=mylogin')
  assert(
    args.fields.password,
    'No password passed, use --field password=mypassword'
  )

  return args
}

const verbosityLevel = {
  1: 'info',
  2: 'debug'
}

const main = async () => {
  const args = parseArgs()
  const client = await createClientInteractive({
    uri: 'http://cozy.tools:8080',
    scope: [
      ACCOUNT_DOCTYPE,
      KONNECTOR_DOCTYPE,
      TRIGGER_DOCTYPE,
      PERMISSION_DOCTYPE,
      JOB_DOCTYPE
    ],
    oauth: {
      softwareID: 'io.cozy.harvest.cli'
    }
  })

  const minVerbosity =
    verbosityLevel[Math.max(args.verbosity, Object.keys(verbosityLevel).length)]
  minilog.suggest.deny('cozy-harvest-lib', minVerbosity)
  await args.handler(args, client)
}

// eslint-disable-next-line promise/catch-or-return
main()
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })
  // eslint-disable-next-line promise/always-return
  .then(() => {
    process.exit(0)
  })
