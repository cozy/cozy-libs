import {
  checkConstraintsOfIinput,
  makeConstraintsOfInput
} from 'src/utils/input'

describe('Input Utils', () => {
  describe('makeInputTypeAndLength', () => {
    it.each`
      attrs                                                                | result
      ${{ type: 'number' }}                                                | ${{ inputType: 'number', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 0, maxLength: 0 }}   | ${{ inputType: 'number', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 10, maxLength: 0 }}  | ${{ inputType: 'number', expectedLength: { min: 10, max: 0 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 0, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 0, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 5, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 5, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 10, maxLength: 10 }} | ${{ inputType: 'number', expectedLength: { min: 10, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: true, minLength: 0, maxLength: 0 }}    | ${{ inputType: 'number', expectedLength: { min: 0, max: 0 }, isRequired: true }}
      ${{ type: 'number', required: true, minLength: 20, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 10, max: 20 }, isRequired: true }}
      ${undefined}                                                         | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'text' }}                                                  | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 0, maxLength: 0 }}     | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 10, maxLength: 0 }}    | ${{ inputType: 'text', expectedLength: { min: 10, max: 0 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 0, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 0, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 5, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 5, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 10, maxLength: 10 }}   | ${{ inputType: 'text', expectedLength: { min: 10, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: true, minLength: 0, maxLength: 0 }}      | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: true }}
      ${{ type: 'text', required: true, minLength: 20, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 10, max: 20 }, isRequired: true }}
    `(
      `should return $result when passed argument: $attrs`,
      ({ attrs, result }) => {
        expect(makeConstraintsOfInput(attrs)).toEqual(result)
      }
    )
  })

  describe('checkInputConstraints', () => {
    it.each`
      valueLength | expectedLength          | isRequired | result
      ${0}        | ${{ min: 0, max: 0 }}   | ${false}   | ${true}
      ${0}        | ${{ min: 0, max: 20 }}  | ${false}   | ${true}
      ${0}        | ${{ min: 10, max: 0 }}  | ${true}    | ${false}
      ${0}        | ${{ min: 10, max: 20 }} | ${true}    | ${false}
      ${10}       | ${{ min: 0, max: 0 }}   | ${false}   | ${true}
      ${10}       | ${{ min: 0, max: 20 }}  | ${false}   | ${true}
      ${21}       | ${{ min: 0, max: 20 }}  | ${false}   | ${false}
      ${0}        | ${{ min: 10, max: 0 }}  | ${true}    | ${false}
      ${10}       | ${{ min: 10, max: 0 }}  | ${true}    | ${true}
      ${0}        | ${{ min: 10, max: 20 }} | ${true}    | ${false}
      ${15}       | ${{ min: 10, max: 20 }} | ${true}    | ${true}
    `(
      `should return $result when passed argument: ($valueLength, $expectedLength, $isRequired)`,
      ({ valueLength, expectedLength, isRequired, result }) => {
        expect(
          checkConstraintsOfIinput(valueLength, expectedLength, isRequired)
        ).toEqual(result)
      }
    )
  })
})
