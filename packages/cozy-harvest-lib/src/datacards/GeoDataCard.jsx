import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
  memo
} from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import IconButton from '@material-ui/core/IconButton'
import SwipeableViews from 'react-swipeable-views'

import isSameDay from 'date-fns/is_same_day'
import isSameYear from 'date-fns/is_same_year'
import format from 'date-fns/format'

import CozyClient, {
  Q,
  queryConnect,
  isQueryLoading,
  hasQueryBeenLoaded
} from 'cozy-client'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ClockIcon from 'cozy-ui/transpiled/react/Icons/Clock'
import CompassIcon from 'cozy-ui/transpiled/react/Icons/Compass'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import LeftIcon from 'cozy-ui/transpiled/react/Icons/Left'
import Typography from 'cozy-ui/transpiled/react/Typography'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import FlagIcon from 'cozy-ui/transpiled/react/Icons/Flag'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import {
  transformTimeSeriesToTrips,
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes
} from './trips'

const setupMap = node => {
  var map = L.map(node).setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  return map
}

const mapStyle = {
  height: 300
}

const POMEGRANATE = '#FF0017'
const EMERALD = '#00D35A'
const SLATE_GREY = '#313640'

const geojsonMarkerOptions = {
  radius: 6,
  color: SLATE_GREY,
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

const pointToLayer = (feature, latlng) => {
  return L.circleMarker(latlng, {
    ...geojsonMarkerOptions,
    fillColor:
      feature.properties.feature_type == 'end_place' ? POMEGRANATE : EMERALD
  })
}

const geojsonOptions = { pointToLayer }

const TripsMap = ({ trips, index }) => {
  const nodeRef = useRef()
  const mapRef = useRef()
  const tripsRef = useRef([])

  useEffect(() => {
    mapRef.current = setupMap(nodeRef.current, trips)
    for (let trip of trips) {
      const feature = L.geoJSON(trip, geojsonOptions)
      tripsRef.current.push(feature)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapRef.current) {
      for (let feature of tripsRef.current) {
        mapRef.current.removeLayer(feature)
      }
      mapRef.current.fitBounds(tripsRef.current[index].getBounds())
      mapRef.current.addLayer(tripsRef.current[index])
    }
  }, [index])
  return <div style={mapStyle} ref={nodeRef} />
}

const useCarrousel = (initialState, min, max) => {
  const [curIndex, setIndex] = useState(0)

  const handlePrev = useCallback(() => {
    const prev = curIndex - 1
    setIndex(prev < min ? max : prev)
  }, [curIndex, min, max])

  const handleNext = useCallback(() => {
    const next = curIndex + 1
    setIndex(next > max ? min : next)
  }, [curIndex, max, min])

  return [curIndex, handlePrev, handleNext]
}

const formatDistance = (t, argDistance) => {
  let unit = 'm'
  let distance = argDistance
  if (distance > 1000) {
    unit = 'km'
    distance = distance / 1000
  }
  return `${Math.round(distance)}${unit}`
}

const MiddleDot = () => {
  return <span className="u-mh-half">·</span>
}

const TripInfoSlideRaw = ({ trip, loading }) => {
  const { t } = useI18n()
  const duration = useMemo(() => trip && getFormattedDuration(trip), [trip])
  const modes = useMemo(() => trip && getModes(trip), [trip])
  return (
    <div>
      <Media className="u-mb-half">
        <Img>
          <Icon icon={FlagIcon} color="var(--emerald)" className="u-mr-half" />
        </Img>
        <Bd>
          {loading ? (
            <Skeleton height={20.5} className="u-pv-half" />
          ) : (
            <Typography variant="body1">
              {getStartPlaceDisplayName(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
      <Media className="u-mb-half">
        <Img>
          <Icon
            icon={FlagIcon}
            color="var(--pomegranate)"
            className="u-mr-half"
          />
        </Img>
        <Bd>
          {loading ? (
            <Skeleton height={20.5} className="u-pv-half" />
          ) : (
            <Typography variant="body1">
              {getEndPlaceDisplayName(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
      {loading ? null : (
        <Typography variant="caption">
          <Icon icon={ClockIcon} size={10} /> {duration}
          <MiddleDot />
          <Icon icon={CompassIcon} size={10} />{' '}
          {formatDistance(t, trip.properties.distance)}
          <MiddleDot />
          {modes.map(m => t(`datacards.trips.modes.${m}`)).join(', ')}
        </Typography>
      )}
    </div>
  )
}

const getSwiperTitle = trip => {
  const now = new Date()
  const startDate = new Date(trip.properties.start_fmt_time)
  const endDate = new Date(trip.properties.end_fmt_time)
  if (isSameDay(startDate, endDate)) {
    const yearToken = isSameYear(startDate, now) ? '' : ' YYYY'
    return `${format(startDate, `ddd DD MMM${yearToken}, HH:mm`)} - ${format(
      endDate,
      'HH:mm'
    )}`
  } else {
    return `${format(startDate, 'DDD MMM YYYY, HH:mm')} - ${format(
      endDate,
      'DDD MM YYYY, HH:mm'
    )}`
  }
}

const TripSwiperTitle = ({ trip }) => {
  const message = useMemo(() => trip && getSwiperTitle(trip), [trip])
  return <Typography variant="subtitle1">{message}</Typography>
}

const TripInfoSlide = memo(TripInfoSlideRaw)

const GeoDataCard = ({ trips, loading, konnector }) => {
  const { t } = useI18n()
  const [index, setPrev, setNext] = useCarrousel(
    0,
    0,
    loading || !trips ? 0 : trips.length - 1
  )
  return (
    <Card className="u-ph-0 u-pb-0 u-ov-hidden">
      <div className="u-ph-1 u-mb-half">
        <Typography variant="h5">{t('datacards.trips.title')}</Typography>
        <Typography variant="caption">
          {t('datacards.trips.caption', { konnectorName: konnector.name })}
        </Typography>
      </div>
      <Media>
        <Img className="u-pl-half">
          <IconButton onClick={setPrev}>
            <Icon icon={LeftIcon} />
          </IconButton>
        </Img>
        <Bd className="u-ta-center">
          {trips ? <TripSwiperTitle trip={trips[index]} /> : <Skeleton />}
        </Bd>
        <Img className="u-pr-half">
          <IconButton onClick={setNext}>
            <Icon icon={RightIcon} />
          </IconButton>
        </Img>
      </Media>
      <Media className="u-ph-1 u-mb-1">
        <Bd>
          <Box ml={1} mr={1}>
            {loading ? (
              <TripInfoSlide loading />
            ) : (
              <SwipeableViews index={index} disabled>
                {trips.map(trip => {
                  return <TripInfoSlide key={trip.id} trip={trip} />
                })}
              </SwipeableViews>
            )}
          </Box>
        </Bd>
      </Media>
      {loading ? (
        <Skeleton variant="rect" width="100%" height={300} />
      ) : (
        <TripsMap trips={trips} index={index} />
      )}
    </Card>
  )
}

const makeQueryFromProps = ({ accountId }) => ({
  query: Q('io.cozy.timeseries.geojson')
    .where({
      'cozyMetadata.sourceAccount': accountId
    })
    .sortBy([{ 'cozyMetadata.sourceAccount': 'asc' }, { startDate: 'asc' }])
    .indexFields(['cozyMetadata.sourceAccount', 'startDate'])
    .limitBy(5),
  as: `io.cozy.accounts/${accountId}/io.cozy.timeseries.geojson`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 & 1000)
})

const DataGeoDataCard = ({ timeseriesCol, konnector }) => {
  const { data: timeseries } = timeseriesCol
  const trips = useMemo(() => {
    if (!timeseries || !timeseries.length) {
      return []
    } else {
      return transformTimeSeriesToTrips(timeseries)
    }
  }, [timeseries])
  const noTimeseries =
    hasQueryBeenLoaded(timeseriesCol) && timeseries.length == 0
  const isLoading = isQueryLoading(timeseriesCol)
  return noTimeseries ? null : (
    <GeoDataCard trips={trips} loading={isLoading} konnector={konnector} />
  )
}

DataGeoDataCard.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired
}

export default queryConnect({
  timeseriesCol: props => makeQueryFromProps(props)
})(DataGeoDataCard)
