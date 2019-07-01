import { mapStateToProps } from './CompletedFromMyselfStatus'

describe('CompletedFromMyselfStatus container', () => {
  describe('mapStateToProps', () => {
    it('should map completed and total to props', () => {
      const state = {
        personalData: {
          completedFromMyself: 3,
          data: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@me.com',
            phone: undefined,
            address: null,
            salary: ''
          }
        }
      }

      const result = mapStateToProps(state)
      expect(result).toEqual({
        completed: 3,
        total: 6
      })
    })
  })
})
