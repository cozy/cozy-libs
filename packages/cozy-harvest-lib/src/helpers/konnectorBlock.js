import get from 'lodash/get'

import { triggers } from 'cozy-client/dist/models/trigger'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker'

import { hasNewVersionAvailable } from './konnectors'
import {
  buildKonnectorQuery,
  buildAccountQuery,
  buildTriggersQuery,
  buildTriggersByIdQuery
} from './queries'
import logger from '../logger'
import sentryHub from '../sentry'

const formatKonnector = ({
  client,
  konnector,
  universalLink,
  iconStatus,
  message
}) => {
  const link = generateUniversalLink({
    cozyUrl: client.getStackClient().uri,
    slug: universalLink.slug,
    subDomainType: client.getInstanceOptions().cozySubdomainType,
    nativePath: universalLink.nativePath
  })

  return {
    name: konnector.name,
    link,
    vendorLink: konnector.vendor_link && {
      component: 'a',
      href: konnector.vendor_link,
      target: '_blank'
    },
    iconStatus,
    message
  }
}

// TODO should be in cozy-client as a new method of client
// see https://github.com/cozy/cozy-client/issues/867#issuecomment-773907266
const fetchDataFromState = async (client, query) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await client.query(query.definition, query.options)
    const { data } = client.getQueryFromState(query.options.as)
    return data[0]
  } catch (error) {
    throw error
  }
}

const fetchKonnector = (client, query) => fetchDataFromState(client, query)

const isAccountConnected = async (client, sourceAccount) => {
  const query = buildAccountQuery(sourceAccount)
  const data = await fetchDataFromState(client, query)
  return !!data
}

// Only konnectors from the registry have a maintenance status
// so we need to fetch registry to get this information
const isInMaintenance = async (client, slug) => {
  const konnector = await konnectorBlock.fetchKonnector(
    client,
    buildKonnectorQuery(slug, 'registry')
  )
  return get(konnector, 'maintenance_activated', false)
}

const isInError = async ({ client, slug, sourceAccount }) => {
  const query = buildTriggersQuery(slug, sourceAccount)
  const data = await fetchDataFromState(client, query)
  const triggerId = get(data, 'id')

  const triggersByIdQuery = buildTriggersByIdQuery(triggerId)
  const trigger = await fetchDataFromState(client, triggersByIdQuery)

  const inError = get(trigger, 'current_state.status') === 'errored'

  if (!inError) {
    return { error: null }
  }

  const message = get(trigger, 'current_state.last_error')

  const isActionable = triggers.hasActionableError(trigger)

  return { error: { message, isActionable } }
}

const fatalError = ({ t, slug, error, consoleMessage }) => {
  logger.error(`konnectorBlock : ${consoleMessage}`)
  logger.error(error)
  sentryHub.withScope(scope => {
    scope.setTag('konnectorBlock with konnector', slug)

    // Capture the original exception instead of the user one
    sentryHub.captureException(error.original || error)
  })
  return {
    fatalError: t('konnectorBlock.fatalError', {
      name: 'support@cozycloud.cc',
      link: 'mailto:support@cozycloud.cc'
    })
  }
}

const statusToFormatOptions = {
  noAccountConnected: ({ client, konnector, slug, t }) =>
    formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'home',
        nativePath: `connected/${slug}/new`
      },
      iconStatus: 'disabled',
      message: {
        text: t('konnectorBlock.disconnected')
      }
    }),
  inMaintenance: ({ client, konnector, slug, t }) =>
    formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'home',
        nativePath: `connected/${slug}`
      },
      iconStatus: 'disabled',
      message: {
        text: t('konnectorBlock.inMaintenance')
      }
    }),
  inError: ({ client, konnector, slug, t, error }) => {
    const color =
      error.isActionable || hasNewVersionAvailable(konnector)
        ? 'error'
        : 'textSecondary'
    return formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'home',
        nativePath: `connected/${slug}`
      },
      iconStatus: 'disabled',
      message: {
        text: t(`error.job.${error.message}.title`),
        color
      }
    })
  },
  hasNewVersionAvailable: ({ client, konnector, slug, t }) =>
    formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'home',
        nativePath: `connected/${slug}`
      },
      message: {
        text: t('konnectorBlock.hasNewVersionAvailable'),
        color: 'primary'
      }
    }),
  default: ({ client, konnector, slug, sourceAccount }) =>
    formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'home',
        nativePath: `connected/${slug}/accounts/${sourceAccount}`
      }
    }),
  stackNotFound: ({ client, konnector, slug }) =>
    formatKonnector({
      client,
      konnector: konnector.attributes,
      universalLink: {
        slug: 'store',
        nativePath: `discover/${slug}`
      },
      iconStatus: 'disabled'
    }),
  stackErrorOtherThan404: ({ t, slug, error }) =>
    fatalError({
      t,
      slug,
      error,
      consoleMessage: 'This is a stack error other than 404'
    }),
  registryError: ({ t, slug, error }) =>
    fatalError({ t, slug, error, consoleMessage: 'This is a registry error' })
}

const fetchKonnectorStatus = async ({ client, slug, sourceAccount }) => {
  try {
    const konnector = await konnectorBlock.fetchKonnector(
      client,
      buildKonnectorQuery(slug, 'stack')
    )

    const accountConnected = await konnectorBlock.isAccountConnected(
      client,
      sourceAccount
    )
    if (!accountConnected) {
      return { konnector, status: 'noAccountConnected' }
    }

    const inMaintenance = await konnectorBlock.isInMaintenance(client, slug)
    if (inMaintenance) {
      return { konnector, status: 'inMaintenance' }
    }

    const { error } = await konnectorBlock.isInError({
      client,
      slug,
      sourceAccount
    })
    if (error) {
      return { konnector, status: 'inError', error }
    }

    if (hasNewVersionAvailable(konnector)) {
      return { konnector, status: 'hasNewVersionAvailable' }
    }

    return { konnector, status: 'default' }
  } catch (error) {
    // The konnector can be uninstalled and returned 404
    if (error.status === 404) {
      try {
        const konnector = await konnectorBlock.fetchKonnector(
          client,
          buildKonnectorQuery(slug, 'registry')
        )
        return { konnector, status: 'stackNotFound' }
      } catch (error) {
        return { status: 'registryError', error }
      }
    }
    return { status: 'stackErrorOtherThan404', error }
  }
}

export const fetchKonnectorData = async ({
  client,
  t,
  slug,
  sourceAccount
}) => {
  const { konnector, status, error } = await fetchKonnectorStatus({
    client,
    slug,
    sourceAccount
  })

  return statusToFormatOptions[status]({
    client,
    konnector,
    slug,
    t,
    sourceAccount,
    error
  })
}

const konnectorBlock = {
  fetchKonnectorData,
  fetchKonnector,
  isAccountConnected,
  isInError,
  isInMaintenance
}

export default konnectorBlock
