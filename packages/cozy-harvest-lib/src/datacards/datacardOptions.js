/**
 * This file list all possible doctypes to datacard possibilities.
 * Its default export can be used as the value of the doctypeToDataCard
 * prop of Harvest's <Routes> component (see Readme.md "Data cards" section).
 *
 * Beware that if you import this file, you will have to install
 * all dependencies that are necessary for all types of data card.
 */

import get from 'lodash/get'

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

const options = {
  datacards: [timeseriesGeoJSONDatacard, filesDatacard]
}

export default options
