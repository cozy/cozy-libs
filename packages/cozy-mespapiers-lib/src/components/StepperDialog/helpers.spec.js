import { handleBack } from './helpers'

const mockAllCurrentSteps = [
  { stepIndex: 1, model: 'scan' },
  { stepIndex: 2, model: 'information' },
  { stepIndex: 3, model: 'contact' }
]
const allCurrentSteps = mockAllCurrentSteps
const previousStep = jest.fn()
const setCurrentStepIndex = jest.fn()
const onClose = jest.fn()
window.open = jest.fn()

describe('handleBack', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when currentStepIndex <= 1', () => {
    const currentStepIndex = 1

    describe('if isMobile is true', () => {
      const isMobile = true

      it('should call onClose function', () => {
        handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: '',
          isMobile,
          onClose
        })

        expect(onClose).toBeCalled()
      })
    })

    describe('if isMobile is false', () => {
      const isMobile = false

      it('should go to fromFlagshipUpload if defined', () => {
        handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: 'https://cozy.io/',
          isMobile,
          onClose
        })

        expect(window.open).toBeCalledWith('https://cozy.io/', '_self')
      })

      it('should do nothing if no fromFlagshipUpload', () => {
        const res = handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: undefined,
          isMobile,
          onClose
        })

        expect(window.open).not.toBeCalled()
        expect(onClose).not.toBeCalled()
        expect(res).toBeUndefined()
      })
    })
  })

  describe('when currentStepIndex > 1', () => {
    const currentStepIndex = 2
    const isMobile = undefined

    describe('for defined fromFlagshipUpload', () => {
      const fromFlagshipUpload = 'https://cozy.io/'

      describe('if the previous step is a scan step or front page', () => {
        it('should go to fromFlagshipUpload if not possible to go 2 steps back', () => {
          handleBack({
            allCurrentSteps,
            currentStepIndex,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            isMobile,
            onClose
          })

          expect(window.open).toBeCalledWith('https://cozy.io/', '_self')
        })

        it('should go 2 steps back if possible', () => {
          handleBack({
            allCurrentSteps: [
              { stepIndex: 1, model: 'information' },
              { stepIndex: 2, model: 'scan' },
              { stepIndex: 3, model: 'contact' }
            ],
            currentStepIndex: 3,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            isMobile,
            onClose
          })

          expect(previousStep).not.toBeCalled()
          expect(setCurrentStepIndex).toBeCalledWith(1)
          expect(window.open).not.toBeCalled()
        })
      })

      describe('if the previous step is not a scan step or front page', () => {
        it('should go to the previous step', () => {
          handleBack({
            allCurrentSteps,
            currentStepIndex: 3,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            isMobile,
            onClose
          })

          expect(previousStep).toBeCalled()
          expect(setCurrentStepIndex).not.toBeCalled()
          expect(window.open).not.toBeCalled()
        })
      })
    })

    describe('for undefined fromFlagshipUpload', () => {
      const fromFlagshipUpload = undefined

      it('should go to previous step', () => {
        handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload,
          isMobile,
          onClose
        })

        expect(previousStep).toBeCalled()
        expect(window.open).not.toBeCalled()
        expect(onClose).not.toBeCalled()
      })
    })
  })
})
