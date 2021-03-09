import get from 'lodash/get'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import distanceInWords from 'date-fns/distance_in_words'

export const collectFeaturesByOid = geojson => {
  const res = {}
  for (let item of geojson) {
    for (let feature of item.features) {
      res[feature.id] = feature
    }
  }
  return res
}

/**
 * Prepare timeseries for easier consumption by React components
 *
 * Resolves $oid pointers for start_place and end_place
 */
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
export const getFormattedDuration = trip => {
  const startDate = new Date(trip.properties.start_fmt_time)
  const endDate = new Date(trip.properties.end_fmt_time)
  return distanceInWords(endDate, startDate)
}

export const getModes = trip => {
  return uniq(
    flatten(
      trip.features.map(feature => {
        if (feature.features) {
          return feature.features.map(feature =>
            get(feature, 'properties.sensed_mode')
          )
        } else {
          return get(feature, 'properties.sensed_mode')
        }
      })
    )
      .map(x => (x ? x.split('PredictedModeTypes.')[1] : null))
      .filter(Boolean)
  )
}
