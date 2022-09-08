import InputDateAdapter from '../components/ModelSteps/widgets/InputDateAdapter'
import InputTextAdapter from '../components/ModelSteps/widgets/InputTextAdapter'
import { getInputsInformationStep } from './getInputsInformationStep'

const attributes = [
  {
    name: 'cardNumber',
    type: 'text',
    maxLength: 12,
    inputLabel: 'PaperJSON.card.number.inputLabel'
  },
  {
    name: 'expirationDate',
    type: 'date',
    inputLabel: 'PaperJSON.card.expirationDate.inputLabel'
  }
]

const inputTextExpected = {
  Component: InputTextAdapter,
  attrs: {
    inputLabel: 'PaperJSON.card.number.inputLabel',
    maxLength: 12,
    name: 'cardNumber',
    type: 'text'
  }
}
const inputDateExpected = {
  Component: InputDateAdapter,
  attrs: {
    inputLabel: 'PaperJSON.card.expirationDate.inputLabel',
    name: 'expirationDate',
    type: 'date'
  }
}

describe('getInputsInformationStep', () => {
  it('should return empty array', () => {
    const res = getInputsInformationStep()
    expect(res).toEqual([])
  })

  it('should return a array of Input of type text', () => {
    const res = getInputsInformationStep([attributes[0]])
    expect(res).toEqual([inputTextExpected])
  })
  it('should return a array of Input of type date', () => {
    const res = getInputsInformationStep([attributes[1]])
    expect(res).toEqual([inputDateExpected])
  })
  it('should return a array of Input of type text & date', () => {
    const res = getInputsInformationStep(attributes)
    expect(res).toEqual([inputTextExpected, inputDateExpected])
  })
})
