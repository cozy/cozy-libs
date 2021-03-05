import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

export const collectFeaturesByOid = geojson => {
  const res = {}
  for (let item of geojson) {
    for (let feature of item.features) {
      res[feature.id] = feature
    }
  }
  return res
}

export const transformSingleTimeSeriesToTrips = singleTimeseries => {
  const { features, properties } = singleTimeseries
  const featureIndex = keyBy(features, feature => feature.id)
  return merge({}, singleTimeseries, {
    properties: {
      start_place: {
        data: featureIndex[properties.start_place['$oid']]
      },
      end_place: {
        data: featureIndex[properties.end_place['$oid']]
      }
    }
  })
}

/**
 * Prepare timeseries for easier consumption by React components
 *
 *
 * Resolves $oid pointers for start_place and end_place
 */
export const transformTimeSeriesToTrips = geojsonTimeseries => {
  const allSeries = flatten(geojsonTimeseries.map(g => g.series))
  return allSeries.map(transformSingleTimeSeriesToTrips)
}

export const getStartPlaceDisplayName = trip => {
  return get(trip, 'properties.start_place.data.properties.display_name')
}

export const getEndPlaceDisplayName = trip => {
  return get(trip, 'properties.end_place.data.properties.display_name')
}

export const getStartPlaceCaption = trip => {
  return format(get(trip, 'properties.start_fmt_time'), 'HH:mm DD/MM/YYYY')
}

export const getEndPlaceCaption = trip => {
  return format(get(trip, 'properties.end_fmt_time'), 'HH:mm DD/MM/YYYY')
}
