import reducer, {
  getAmount,
  getDuration,
  getInitialized,
  updateAmount,
  updateDuration,
  initializationSuccess
} from './procedureDataSlice'

const slice = {
  data: {
    amount: 10000,
    duration: 36
  },
  ui: {
    initialized: false
  }
}

const state = {
  procedureData: slice
}

describe('procedureDataSlice', () => {
  describe('reducer', () => {
    it('should return initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        data: {
          amount: null,
          duration: null
        },
        ui: {
          initialized: false
        }
      })
    })

    it('should handle updateAmount action', () => {
      const action = updateAmount(2500)
      expect(reducer(slice, action)).toEqual({
        data: {
          amount: 2500,
          duration: 36
        },
        ui: {
          initialized: false
        }
      })
    })

    it('should handle updateAmount action', () => {
      const action = updateDuration(24)
      expect(reducer(slice, action)).toEqual({
        data: {
          amount: 10000,
          duration: 24
        },
        ui: {
          initialized: false
        }
      })
    })

    it('should handle initializationSuccess action', () => {
      const action = initializationSuccess()
      expect(reducer(slice, action)).toEqual({
        data: {
          amount: 10000,
          duration: 36
        },
        ui: {
          initialized: true
        }
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

    describe('getInitialized selector', () => {
      it('should return whether the procedure is initialized or not', () => {
        const result = getInitialized(state)
        expect(result).toEqual(false)
      })
    })
  })
})
