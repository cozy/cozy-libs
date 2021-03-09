import exampleData from './GeoDataCard.fixture.json'
import { transformTimeSeriesToTrips, getModes } from './trips'

const series = exampleData['io.cozy.timeseries.geojson']
describe('trips', () => {
  it('should prepare data for easy downstream consumption', () => {
    const data = transformTimeSeriesToTrips(series)
    expect(data[0].properties.start_place.data.properties.display_name).toEqual(
      'Avenue Simón Bolívar, Paris'
    )
    expect(data[0].properties.end_place.data.properties.display_name).toEqual(
      'Rue Stephenson, Paris'
    )
  })
})

describe('trips', () => {
  it('should get modes', () => {
    const data = transformTimeSeriesToTrips(series)
    const trip = data[0]
    const modes = getModes(trip)
    expect(modes).toEqual(['WALKING', 'AIR_OR_HSR'])
  })
})
