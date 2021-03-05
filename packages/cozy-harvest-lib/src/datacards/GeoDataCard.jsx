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

import CozyClient, { Q, queryConnect } from 'cozy-client'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
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
  getStartPlaceCaption,
  getEndPlaceCaption
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

const TripInfoSlideRaw = ({ trip, loading }) => {
  return (
    <div>
      <Media>
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
          {!loading ? (
            <Typography variant="caption">
              {getStartPlaceCaption(trip)}
            </Typography>
          ) : null}
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
          {loading ? null : (
            <Typography variant="caption">
              {getEndPlaceCaption(trip)}
            </Typography>
          )}
        </Bd>
      </Media>
    </div>
  )
}

const TripInfoSlide = memo(TripInfoSlideRaw)

const GeoDataCard = ({ trips, loading, konnector }) => {
  console.log('trips iun geo card ? ', trips)
  const { t } = useI18n()
  const [index, setPrev, setNext] = useCarrousel(
    0,
    0,
    loading ? 0 : trips.length - 1
  )
  return (
    <Card className="u-ph-0 u-pb-0 u-ov-hidden">
      <div className="u-ph-1 u-mb-half">
        <Typography variant="h5">{t('datacards.trips.title')}</Typography>
        <Typography variant="caption">
          {t('datacards.trips.caption', { konnectorName: konnector.name })}
        </Typography>
      </div>
      <Media className="u-mb-1">
        <Img className="u-pl-half">
          <IconButton onClick={setPrev}>
            <Icon icon={LeftIcon} />
          </IconButton>
        </Img>
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
        <Img className="u-pr-half">
          <IconButton onClick={setNext}>
            <Icon icon={RightIcon} />
          </IconButton>
        </Img>
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
    .sortBy([
      { 'cozyMetadata.sourceAccount': 'desc' },
      { 'cozyMetadata.createdAt': 'desc' }
    ])
    .indexFields(['cozyMetadata.sourceAccount', 'cozyMetadata.createdAt'])
    .limitBy(5),
  as: `io.cozy.accounts/${accountId}/io.cozy.timeseries.geojson`,
  fetchPolicy: CozyClient.fetchPolicies.olderThan(30 & 1000)
})

const DataGeoDataCard = ({ timeseriesCol, konnector }) => {
  const { data: timeseries, fetchStatus } = timeseriesCol
  const trips = useMemo(() => {
    if (!timeseries || !timeseries.length) {
      return
    } else {
      return transformTimeSeriesToTrips(timeseries)
    }
  }, [timeseries])
  const noTimeseries =
    (!trips || trips.length === 0) && fetchStatus !== 'loading'
  const isLoading = fetchStatus === 'loading' && (!trips || trips.length === 0)
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
