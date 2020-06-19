import {
  normalizeDocFromRealtime,
  updateInternalObjectFromRealtime
} from './realtime'
import {
  SHARING1_FROM_REALTIME,
  SHARING2_FROM_REALTIME,
  SHARINGS_DOCTYPE,
  SHARING1_FROM_INTERNAL_STORE
} from '../../test/fixtures/realtimesharing'
describe('realtime helpers', () => {
  it('test if the object is well formated if received from the realtime', () => {
    const createdFakeObjectFromRealtime = normalizeDocFromRealtime(
      SHARING1_FROM_REALTIME,
      SHARINGS_DOCTYPE
    )
    expect(createdFakeObjectFromRealtime.id).toEqual(SHARING1_FROM_REALTIME._id)
    expect(createdFakeObjectFromRealtime.attributes.id).toEqual(
      SHARING1_FROM_REALTIME._id
    )
    expect(createdFakeObjectFromRealtime.members).toEqual(
      SHARING1_FROM_REALTIME.members
    )
    expect(createdFakeObjectFromRealtime.attributes.members).toEqual(
      SHARING1_FROM_REALTIME.members
    )
  })

  it('test if the updateInternalObject is working as expected', () => {
    const updatedObject = updateInternalObjectFromRealtime(
      SHARING1_FROM_INTERNAL_STORE,
      SHARING2_FROM_REALTIME
    )
    expect(updatedObject.id).toEqual(SHARING1_FROM_INTERNAL_STORE._id)
    expect(updatedObject.meta.rev).toEqual(SHARING2_FROM_REALTIME._rev)
    expect(updatedObject.attributes).toEqual(SHARING2_FROM_REALTIME)
  })
})
