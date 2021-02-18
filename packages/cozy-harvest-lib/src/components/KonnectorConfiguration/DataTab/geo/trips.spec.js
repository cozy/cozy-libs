import exampleData from './example'
import { prepareTrips } from './trips'

describe('trips', () => {
  it('should prepare data for easy downstream consumption', () => {
    const data = prepareTrips(exampleData.data)
    expect(data[0].properties.start_place.data.properties.display_name).toEqual(
      'Church Street, Mountain View'
    )
    expect(data[0].properties.end_place.data.properties.display_name).toEqual(
      'Franklin Street, Mountain View'
    )
  })
})
