import { fetchCurrentUser } from './fetchCurrentUser'

describe('fetchCurrentUser', () => {
  it('should return current user', async () => {
    const client = {
      collection: jest.fn(() => ({
        findMyself: jest.fn(() => ({ data: [{ fullname: 'Bob', me: true }] }))
      }))
    }
    const currentUser = await fetchCurrentUser(client)

    expect(currentUser.fullname).toBeTruthy()
    expect(currentUser).toHaveProperty('me', true)
  })
  it('should return "null" if the current user is not found', async () => {
    const client = {
      collection: jest.fn(() => ({
        findMyself: jest.fn(() => ({ data: [] }))
      }))
    }
    const currentUser = await fetchCurrentUser(client)

    expect(currentUser).toBeNull()
  })
  it('should return "null" if the current user is fetching it throws an error', async () => {
    const client = {
      collection: jest.fn(() => ({
        findMyself: jest.fn(() => {
          throw new Error('Error')
        })
      }))
    }
    const currentUser = await fetchCurrentUser(client)

    expect(currentUser).toBeNull()
  })
})
