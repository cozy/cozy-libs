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
})
