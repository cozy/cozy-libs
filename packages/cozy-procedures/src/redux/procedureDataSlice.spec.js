import reducer, {
  getAmount,
  getDuration,
  updateAmount,
  updateDuration
} from './procedureDataSlice'

const slice = {
  amount: 10000,
  duration: 36
}

const state = {
  procedureData: slice
}

describe('procedureDataSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        amount: null,
        duration: null
      })
    })

    it('should handle updateAmount action', () => {
      const action = updateAmount(2500)
      expect(reducer(slice, action)).toEqual({
        amount: 2500,
        duration: 36
      })
    })

    it('should handle updateAmount action', () => {
      const action = updateDuration(24)
      expect(reducer(slice, action)).toEqual({
        amount: 10000,
        duration: 24
      })
    })
  })

  describe('selectors', () => {
    describe('getAmount selector', () => {
      it('should return the amount value', () => {
        const result = getAmount(state)
        expect(result).toEqual(10000)
      })
    })

    describe('getDuration selector', () => {
      it('should return the duration value', () => {
        const result = getDuration(state)
        expect(result).toEqual(36)
      })
    })
  })
})
