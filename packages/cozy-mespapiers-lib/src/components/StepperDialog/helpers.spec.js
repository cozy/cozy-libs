import { handleBack } from './helpers'

const mockAllCurrentSteps = [
  { model: 'scan' },
  { model: 'information' },
  { model: 'contact' }
]
const allCurrentSteps = mockAllCurrentSteps
const previousStep = jest.fn()
const setCurrentStepIndex = jest.fn()
const onClose = jest.fn()
const webviewIntent = { call: jest.fn() }

describe('handleBack', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('when currentStepIndex == 0', () => {
    const currentStepIndex = 0

    describe('if isMobile is true', () => {
      const isMobile = true

      it('should call onClose function', async () => {
        await handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: '',
          webviewIntent,
          isMobile,
          onClose
        })

        expect(onClose).toBeCalled()
      })
    })

    describe('if isMobile is false', () => {
      const isMobile = false

      it('should go to fromFlagshipUpload if defined', async () => {
        await handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: 'https://cozy.io/',
          webviewIntent,
          isMobile,
          onClose
        })

        expect(webviewIntent.call).toBeCalledWith('cancelUploadByCozyApp')
      })

      it('should do nothing if no fromFlagshipUpload', async () => {
        const res = await handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload: undefined,
          webviewIntent,
          isMobile,
          onClose
        })

        expect(webviewIntent.call).not.toBeCalled()
        expect(onClose).not.toBeCalled()
        expect(res).toBeUndefined()
      })
    })
  })

  describe('when currentStepIndex > 0', () => {
    const currentStepIndex = 1
    const isMobile = undefined

    describe('for defined fromFlagshipUpload', () => {
      const fromFlagshipUpload = 'https://cozy.io/'

      describe('if the previous step is a scan step or front page', () => {
        it('should go to fromFlagshipUpload if not possible to go 2 steps back', async () => {
          await handleBack({
            allCurrentSteps,
            currentStepIndex,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            webviewIntent,
            isMobile,
            onClose
          })

          expect(webviewIntent.call).toBeCalledWith('cancelUploadByCozyApp')
        })

        it('should go 2 steps back if possible', async () => {
          await handleBack({
            allCurrentSteps: [
              { model: 'information' },
              { model: 'scan' },
              { model: 'contact' }
            ],
            currentStepIndex: 2,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            webviewIntent,
            isMobile,
            onClose
          })

          expect(previousStep).not.toBeCalled()
          expect(setCurrentStepIndex).toBeCalledWith(0)
          expect(webviewIntent.call).not.toBeCalled()
        })
      })

      describe('if the previous step is not a scan step or front page', () => {
        it('should go to the previous step', async () => {
          await handleBack({
            allCurrentSteps,
            currentStepIndex: 2,
            previousStep,
            setCurrentStepIndex,
            fromFlagshipUpload,
            webviewIntent,
            isMobile,
            onClose
          })

          expect(previousStep).toBeCalled()
          expect(setCurrentStepIndex).not.toBeCalled()
          expect(webviewIntent.call).not.toBeCalled()
        })
      })
    })

    describe('for undefined fromFlagshipUpload', () => {
      const fromFlagshipUpload = undefined

      it('should go to previous step', async () => {
        await handleBack({
          allCurrentSteps,
          currentStepIndex,
          previousStep,
          setCurrentStepIndex,
          fromFlagshipUpload,
          webviewIntent,
          isMobile,
          onClose
        })

        expect(previousStep).toBeCalled()
        expect(webviewIntent.call).not.toBeCalled()
        expect(onClose).not.toBeCalled()
      })
    })
  })
})
