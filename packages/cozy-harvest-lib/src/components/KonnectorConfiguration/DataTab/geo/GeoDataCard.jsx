import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
  memo
} from 'react'
import Card from 'cozy-ui/transpiled/react/Card'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Box from '@material-ui/core/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import IconButton from '@material-ui/core/IconButton'
import SwipeableViews from 'react-swipeable-views'
import LeftIcon from 'cozy-ui/transpiled/react/Icons/Left'
import Typography from 'cozy-ui/transpiled/react/Typography'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import FlagIcon from 'cozy-ui/transpiled/react/Icons/Flag'

import exampleData from './example.json'
import {
  prepareTrips,
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

const TripInfoSlideRaw = ({ trip }) => {
  return (
    <div>
      <Media>
        <Img>
          <Icon icon={FlagIcon} color="var(--emerald)" className="u-mr-half" />
        </Img>
        <Bd>
          <Typography variant="body1">
            {getStartPlaceDisplayName(trip)}
          </Typography>
          <Typography variant="caption">
            {getStartPlaceCaption(trip)}
          </Typography>
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
          <Typography variant="body1">
            {getEndPlaceDisplayName(trip)}
          </Typography>
          <Typography variant="caption">{getEndPlaceCaption(trip)}</Typography>
        </Bd>
      </Media>
    </div>
  )
}

const TripInfoSlide = memo(TripInfoSlideRaw)

const GeoDataCard = ({ trips }) => {
  const enhancedTrips = useMemo(() => prepareTrips(trips), [trips])
  const [index, setPrev, setNext] = useCarrousel(0, 0, trips.length - 1)
  return (
    <Card className="u-ph-0 u-pb-0">
      <Media className="u-mb-1">
        <Img className="u-pl-half">
          <IconButton onClick={setPrev}>
            <Icon icon={LeftIcon} />
          </IconButton>
        </Img>
        <Bd>
          <Box ml={1} mr={1}>
            <SwipeableViews index={index} disabled>
              {enhancedTrips.map(trip => {
                return <TripInfoSlide key={trip.id} trip={trip} />
              })}
            </SwipeableViews>
          </Box>
        </Bd>
        <Img className="u-pr-half">
          <IconButton onClick={setNext}>
            <Icon icon={RightIcon} />
          </IconButton>
        </Img>
      </Media>
      <TripsMap trips={enhancedTrips} index={index} />
    </Card>
  )
}

const GeoDataCardExample = () => {
  return <GeoDataCard trips={exampleData.data} />
}

export default GeoDataCardExample
