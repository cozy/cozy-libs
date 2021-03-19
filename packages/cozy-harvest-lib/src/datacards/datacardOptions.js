/**
 * This file list all possible doctypes to datacard possibilities.
 * Its default export can be used as the value of the doctypeToDataCard
 * prop of Harvest's <Routes> component (see Readme.md "Data cards" section).
 *
 * Beware that if you import this file, you will have to install
 * all dependencies that are necessary for all types of data card.
 */

import flag from 'cozy-flags'
import get from 'lodash/get'
import GeoDataCard from './GeoDataCard'
import FileDataCard from './FileDataCard'

const timeseriesGeoJSONDatacard = {
  component: GeoDataCard,
  match: ({ konnector }) => konnector.permissions['io.cozy.timeseries.geojson']
}

const filesDatacard = {
  component: FileDataCard,
  match: ({ trigger }) =>
    flag('harvest.datacards.files') && get(trigger, 'message.folder_to_save')
}

const options = {
  datacards: [timeseriesGeoJSONDatacard, filesDatacard]
}

export default options
