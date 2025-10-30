import * as Sentry from '@sentry/react'
import get from 'lodash/get'

import { triggers } from 'cozy-client/dist/models/trigger'
import { generateUniversalLink } from 'cozy-ui-plus/dist/AppLinker'

import { getErrorLocale } from './konnectors'
import { hasNewVersionAvailable } from './konnectors'
import {
  buildKonnectorQueryBySlug,
  buildAccountQuery,
  buildTriggersQuery,
  buildAppsRegistryQueryBySlug
} from './queries'
import { fetchTrigger } from '../connections/triggers'
import logger from '../logger'

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

const isAccountConnected = account => {
  return { accountConnected: !!account, sourceAccount: account._id }
}

// Only konnectors from the registry have a maintenance status
// so we need to fetch registry to get this information
const isInMaintenance = async (client, slug) => {
  const konnector = await konnectorBlock.fetchKonnector(
    client,
    buildAppsRegistryQueryBySlug(slug)
  )
  return get(konnector, 'maintenance_activated', false)
}

/**
 *
 * @param {import('cozy-client/types/types').IOCozyTrigger} trigger
 * @returns
 */
const isInError = trigger => {
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
  Sentry.addBreadcrumb({
    category: 'konnector',
    message: `Slug: ${slug}`,
    level: 'info'
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
        text: getErrorLocale(error, konnector, t, 'title'),
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

const fetchAccountAndTrigger = async ({
  client,
  konnector,
  slug,
  sourceAccountIdentifier
}) => {
  const accountQuery = buildAccountQuery({ sourceAccountIdentifier, slug })
  const account = await fetchDataFromState(client, accountQuery)
  const triggerQuery = buildTriggersQuery(account._id, konnector)
  const triggerFromQuery = await fetchDataFromState(client, triggerQuery)
  const trigger = await fetchTrigger(client, triggerFromQuery._id)

  return { account, trigger }
}

const fetchKonnectorStatus = async ({
  client,
  slug,
  sourceAccountIdentifier
}) => {
  try {
    const konnector = await konnectorBlock.fetchKonnector(
      client,
      buildKonnectorQueryBySlug(slug)
    )

    const { account, trigger } = await konnectorBlock.fetchAccountAndTrigger({
      client,
      konnector,
      slug,
      sourceAccountIdentifier
    })

    const { accountConnected, sourceAccount } =
      konnectorBlock.isAccountConnected(account)

    if (!accountConnected) {
      return { konnector, trigger, status: 'noAccountConnected' }
    }

    const inMaintenance = await konnectorBlock.isInMaintenance(client, slug)
    if (inMaintenance) {
      return { konnector, trigger, status: 'inMaintenance' }
    }

    const { error } = await konnectorBlock.isInError(trigger)
    if (error) {
      return { konnector, trigger, status: 'inError', error }
    }

    if (hasNewVersionAvailable(konnector)) {
      return { konnector, trigger, status: 'hasNewVersionAvailable' }
    }

    return { konnector, trigger, status: 'default', sourceAccount }
  } catch (error) {
    // The konnector can be uninstalled and returned 404
    if (error.status === 404) {
      try {
        const konnector = await konnectorBlock.fetchKonnector(
          client,
          buildAppsRegistryQueryBySlug(slug)
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
  sourceAccountIdentifier
}) => {
  const { konnector, trigger, status, error, sourceAccount } =
    await fetchKonnectorStatus({
      client,
      slug,
      sourceAccountIdentifier
    })

  return {
    ...statusToFormatOptions[status]({
      client,
      konnector,
      slug,
      t,
      sourceAccount,
      error
    }),
    trigger
  }
}

const konnectorBlock = {
  fetchKonnectorData,
  fetchKonnector,
  fetchAccountAndTrigger,
  isAccountConnected,
  isInError,
  isInMaintenance
}

export default konnectorBlock
