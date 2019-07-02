import { mapStateToProps } from './CompletedFromDriveStatus'

describe('CompletedFromDriveStatus container', () => {
  describe('mapStateToProps', () => {
    it('should map completed and total to props', () => {
      const state = {
        documents: {
          completedFromDrive: 3,
          data: {},
          ui: {}
        }
      }

      const result = mapStateToProps(state)
      expect(result).toEqual({
        completed: 3,
        total: 5
      })
    })
  })
})
