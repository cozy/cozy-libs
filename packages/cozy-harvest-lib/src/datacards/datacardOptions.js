/**
 * This file list all possible doctypes to datacard possibilities.
 * Its default export can be used as the value of the doctypeToDataCard
 * prop of Harvest's <Routes> component (see Readme.md "Data cards" section).
 *
 * Beware that if you import this file, you will have to install
 * all dependencies that are necessary for all types of data card.
 */

import get from 'lodash/get'

import flag from 'cozy-flags'

import DoctypeDebugCard from './DoctypeDebugCard'
import FileDataCard from './FileDataCard'
import GeoDataCard from './GeoDataCard'

const timeseriesGeoJSONDatacard = {
  component: GeoDataCard,
  match: ({ konnector }) =>
    Object.values(konnector.permissions).filter(
      x => x.type === 'io.cozy.timeseries.geojson'
    ).length > 0
}

const filesDatacard = {
  component: FileDataCard,
  match: ({ trigger }) => get(trigger, 'message.folder_to_save')
}

const filesDebugDatacard = {
  component: options =>
    DoctypeDebugCard({ doctype: 'io.cozy.files', ...options }),
  match: ({ konnector }) =>
    hasPermission(konnector, 'io.cozy.files') &&
    flag('harvest.show-doctype-debug-cards')
}

const identitiesDebugDatacard = {
  component: options =>
    DoctypeDebugCard({ doctype: 'io.cozy.identities', ...options }),
  match: ({ konnector }) =>
    hasPermission(konnector, 'io.cozy.identities') &&
    flag('harvest.show-doctype-debug-cards')
}

const billsDebugDatacard = {
  component: options =>
    DoctypeDebugCard({ doctype: 'io.cozy.bills', ...options }),
  match: ({ konnector }) =>
    hasPermission(konnector, 'io.cozy.bills') &&
    flag('harvest.show-doctype-debug-cards')
}

const options = {
  datacards: [
    timeseriesGeoJSONDatacard,
    filesDatacard,
    filesDebugDatacard,
    identitiesDebugDatacard,
    billsDebugDatacard
  ]
}

function hasPermission(konnector, doctype) {
  return (
    Object.values(konnector.permissions).filter(x => x.type === doctype)
      .length > 0
  )
}

export default options
