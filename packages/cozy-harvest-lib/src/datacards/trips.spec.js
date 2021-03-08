import exampleData from './GeoDataCard.fixture.json'
import { transformTimeSeriesToTrips } from './trips'

describe('trips', () => {
  it('should prepare data for easy downstream consumption', () => {
    const data = transformTimeSeriesToTrips(
      exampleData['io.cozy.timeseries.geojson']
    )
    expect(data[0].properties.start_place.data.properties.display_name).toEqual(
      'Avenue Simón Bolívar, Paris'
    )
    expect(data[0].properties.end_place.data.properties.display_name).toEqual(
      'Rue Stephenson, Paris'
    )
  })
})
