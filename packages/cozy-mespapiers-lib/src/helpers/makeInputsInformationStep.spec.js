import { makeInputsInformationStep } from './makeInputsInformationStep'
import InputDateAdapter from '../components/ModelSteps/widgets/InputDateAdapter'
import InputTextAdapter from '../components/ModelSteps/widgets/InputTextAdapter'

const attributes = [
  {
    name: 'number',
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
    name: 'number',
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

describe('makeInputsInformationStep', () => {
  it('should return empty array', () => {
    const res = makeInputsInformationStep()
    expect(res).toEqual([])
  })

  it('should return a array of Input of type text', () => {
    const res = makeInputsInformationStep([attributes[0]])
    expect(res).toEqual([inputTextExpected])
  })
  it('should return a array of Input of type date', () => {
    const res = makeInputsInformationStep([attributes[1]])
    expect(res).toEqual([inputDateExpected])
  })
  it('should return a array of Input of type text & date', () => {
    const res = makeInputsInformationStep(attributes)
    expect(res).toEqual([inputTextExpected, inputDateExpected])
  })
})
