import isSameDay from 'date-fns/isSameDay'
import isSameYear from 'date-fns/isSameYear'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import sortBy from 'lodash/sortBy'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useMemo, memo } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useI18n } from 'twake-i18n'

import CozyClient, {
  Q,
  queryConnect,
  isQueryLoading,
  hasQueryBeenLoaded,
  RealTimeQueries
} from 'cozy-client'
import flag from 'cozy-flags'
import Box from 'cozy-ui/transpiled/react/Box'
import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import ClockIcon from 'cozy-ui/transpiled/react/Icons/Clock'
import CompassIcon from 'cozy-ui/transpiled/react/Icons/Compass'
import FlagIcon from 'cozy-ui/transpiled/react/Icons/Flag'
import LeftIcon from 'cozy-ui/transpiled/react/Icons/Left'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/deprecated/Media'

import {
  transformTimeSeriesToTrips,
  getStartPlaceDisplayName,
  getEndPlaceDisplayName,
  getFormattedDuration,
  getModes
} from './trips'
import useCycle from './useCycle'
import appLinksProps from '../components/KonnectorConfiguration/DataTab/appLinksProps'
import AppLinkCard from '../components/cards/AppLinkCard'

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

const formatDistance = (t, argDistance) => {
  let unit = 'm'
  let distance = argDistance
  if (distance > 1000) {
    unit = 'km'
    distance = distance / 1000
  }
  return `${Math.round(distance)} ${unit}`
}

const MiddleDot = () => {
  return <span className="u-mh-half">·</span>
}

const infoIconStyle = { marginRight: '0.3125rem' }

const TripInfoSlideRaw = ({ trip, loading }) => {
  const { t } = useI18n()
  const duration = useMemo(() => trip && getFormattedDuration(trip), [trip])
  const modes = useMemo(() => trip && getModes(trip), [trip])
  return (
    <Stack spacing="xs">
      <Media>
        <Img>
          <Icon icon={FlagIcon} color="var(--emerald)" className="u-mr-half" />
        </Img>
        <Bd>
          {loading ? (
            <Skeleton height={16} className="u-pv-half" />
          ) : (
            <Typography variant="body1">
              {getStartPlaceDisplayName(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
      <Media>
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
      <div>
        {loading ? null : (
          <Typography variant="body2" color="textSecondary">
            <Icon style={infoIconStyle} icon={ClockIcon} size={10} />
            {duration}
            <MiddleDot />
            <Icon style={infoIconStyle} icon={CompassIcon} size={10} />
            {formatDistance(t, trip.properties.distance)}
            <MiddleDot />
            {modes.map(m => t(`datacards.trips.modes.${m}`)).join(', ')}
          </Typography>
        )}
      </div>
    </Stack>
  )
}

const getSwiperTitle = (trip, format) => {
  const now = new Date()
  const startDate = new Date(trip.properties.start_fmt_time)
  const endDate = new Date(trip.properties.end_fmt_time)
  if (isSameDay(startDate, endDate)) {
    const yearToken = isSameYear(startDate, now) ? '' : ' YYYY'
    return `${format(startDate, `ddd D MMM${yearToken}, HH:mm`)} - ${format(
      endDate,
      'HH:mm'
    )}`
  } else {
    return `${format(startDate, 'D MMM YYYY, HH:mm')} - ${format(
      endDate,
      'D MM YYYY, HH:mm'
    )}`
  }
}

const TripSwiperTitle = ({ trip }) => {
  const { f } = useI18n()
  const message = useMemo(() => trip && getSwiperTitle(trip, f), [f, trip])
  return <Typography variant="subtitle1">{message}</Typography>
}

const TripInfoSlide = memo(TripInfoSlideRaw)

const GeoDataCard = ({ trips, loading, konnector }) => {
  const { t } = useI18n()
  const [index, setPrev, setNext] = useCycle(
    trips && trips.length > 0 ? trips.length - 1 : undefined,
    0,
    loading || !trips ? undefined : trips.length - 1
  )
  return (
    <Card className="u-ph-0 u-pb-0 u-ov-hidden">
      <div className="u-ph-1 u-mb-half">
        <Typography variant="h6">{t('datacards.trips.title')}</Typography>
        <Typography variant="caption">
          {t('datacards.trips.caption', { konnectorName: konnector.name })}
        </Typography>
      </div>
      <Media>
        <Img className="u-pl-half">
          <IconButton onClick={setPrev} size="medium">
            <Icon icon={LeftIcon} />
          </IconButton>
        </Img>
        <Bd className="u-ta-center">
          {trips ? <TripSwiperTitle trip={trips[index]} /> : <Skeleton />}
          <Typography variant="caption">
            {trips
              ? trips.map((t, i) => (
                  <span key={i}>{i === index ? '●' : '○'}</span>
                ))
              : null}
          </Typography>
        </Bd>
        <Img className="u-pr-half">
          <IconButton onClick={setNext} size="medium">
            <Icon icon={RightIcon} />
          </IconButton>
        </Img>
      </Media>
      <Media className="u-ph-1 u-mb-1">
        <Bd>
          <Box ml={1} mr={1}>
            {loading || index === undefined ? (
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
      {loading || index === undefined ? (
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
    .sortBy([{ 'cozyMetadata.sourceAccount': 'desc' }, { startDate: 'desc' }])
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
  const ascendingTrips = useMemo(() => {
    return sortBy(trips, t => t.properties.enter_fmt_time).reverse()
  }, [trips])
  const noTimeseries =
    hasQueryBeenLoaded(timeseriesCol) && timeseries.length == 0
  const isLoading = isQueryLoading(timeseriesCol)

  if (noTimeseries && flag('harvest.datacard.coachCO2')) {
    // This is hidden between a flag as long as the CoachCO2 app is not in the store
    return <AppLinkCard {...appLinksProps.coachco2()} />
  }
  if (noTimeseries) {
    return null
  }
  return (
    <>
      <GeoDataCard
        trips={ascendingTrips}
        loading={isLoading}
        konnector={konnector}
      />
      {flag('harvest.datacard.coachCO2') ? (
        <AppLinkCard {...appLinksProps.coachco2()} />
      ) : null}
    </>
  )
}

DataGeoDataCard.propTypes = {
  konnector: PropTypes.object.isRequired,
  accountId: PropTypes.string.isRequired
}

const DataGeoDataCardWithRealtime = props => {
  return (
    <>
      <RealTimeQueries doctype="io.cozy.timeseries.geojson" />
      <DataGeoDataCard {...props} />
    </>
  )
}
export default queryConnect({
  timeseriesCol: props => makeQueryFromProps(props)
})(DataGeoDataCardWithRealtime)
