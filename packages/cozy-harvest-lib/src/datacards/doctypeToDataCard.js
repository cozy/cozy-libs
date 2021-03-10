/**
 * This file list all possible doctypes to datacard possibilities.
 * Its default export can be used as the value of the doctypeToDataCard
 * prop of Harvest's <Routes> component (see Readme.md "Data cards" section).
 *
 * Beware that if you import this file, you will have to install
 * all dependencies that are necessary for all types of data card.
 */

import GeoDataCard from './GeoDataCard'
import FileDataCard from './FileDataCard'
import flag from 'cozy-flags'

const doctypeToDataCard = {
  'io.cozy.timeseries.geojson': GeoDataCard
}

if (flag('harvest.datacards.files')) {
  doctypeToDataCard['io.cozy.files'] = FileDataCard
}

export default doctypeToDataCard
