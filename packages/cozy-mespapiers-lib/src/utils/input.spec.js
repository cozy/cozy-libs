import { checkConstraintsOfIinput, makeConstraintsOfInput } from './input'

describe('Input Utils', () => {
  describe('makeInputTypeAndLength', () => {
    it.each`
      attrs                                                                | result
      ${{ type: 'number' }}                                                | ${{ inputType: 'number', expectedLength: { min: null, max: null }, isRequired: false }}
      ${{ type: 'number', mask: '99999' }}                                 | ${{ inputType: 'number', expectedLength: { min: 5, max: 5 }, isRequired: false }}
      ${{ type: 'number', mask: '99999', minLength: 3, maxLength: 7 }}     | ${{ inputType: 'number', expectedLength: { min: 3, max: 5 }, isRequired: false }}
      ${{ type: 'number', mask: '99999', required: true }}                 | ${{ inputType: 'number', expectedLength: { min: 5, max: 5 }, isRequired: true }}
      ${{ type: 'number', mask: '99 99 99 99 99', required: true }}        | ${{ inputType: 'number', expectedLength: { min: 10, max: 10 }, isRequired: true }}
      ${{ type: 'number', mask: '99999', required: true, minLength: 3 }}   | ${{ inputType: 'number', expectedLength: { min: 3, max: 5 }, isRequired: true }}
      ${{ type: 'number', mask: '99999', required: true, maxLength: 7 }}   | ${{ inputType: 'number', expectedLength: { min: 5, max: 5 }, isRequired: true }}
      ${{ type: 'number', required: false, minLength: 0, maxLength: 0 }}   | ${{ inputType: 'number', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 10, maxLength: 0 }}  | ${{ inputType: 'number', expectedLength: { min: 10, max: 0 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 0, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 0, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 5, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 5, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: false, minLength: 10, maxLength: 10 }} | ${{ inputType: 'number', expectedLength: { min: 10, max: 10 }, isRequired: false }}
      ${{ type: 'number', required: true, minLength: 0, maxLength: 0 }}    | ${{ inputType: 'number', expectedLength: { min: 0, max: 0 }, isRequired: true }}
      ${{ type: 'number', required: true, minLength: 20, maxLength: 10 }}  | ${{ inputType: 'number', expectedLength: { min: 10, max: 10 }, isRequired: true }}
      ${undefined}                                                         | ${{ inputType: 'text', expectedLength: { min: null, max: null }, isRequired: false }}
      ${{ type: 'text' }}                                                  | ${{ inputType: 'text', expectedLength: { min: null, max: null }, isRequired: false }}
      ${{ type: 'text', mask: 'aaaaa' }}                                   | ${{ inputType: 'text', expectedLength: { min: 5, max: 5 }, isRequired: false }}
      ${{ type: 'text', mask: 'aaaaa', minLength: 3, maxLength: 7 }}       | ${{ inputType: 'text', expectedLength: { min: 3, max: 5 }, isRequired: false }}
      ${{ type: 'text', mask: 'aaaaa', required: true }}                   | ${{ inputType: 'text', expectedLength: { min: 5, max: 5 }, isRequired: true }}
      ${{ type: 'text', mask: 'aa aa aa aa aa', required: true }}          | ${{ inputType: 'text', expectedLength: { min: 10, max: 10 }, isRequired: true }}
      ${{ type: 'text', mask: 'aaaaa', required: true, minLength: 3 }}     | ${{ inputType: 'text', expectedLength: { min: 3, max: 5 }, isRequired: true }}
      ${{ type: 'text', mask: 'aaaaa', required: true, maxLength: 7 }}     | ${{ inputType: 'text', expectedLength: { min: 5, max: 5 }, isRequired: true }}
      ${{ type: 'text', required: false, minLength: 0, maxLength: 0 }}     | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 10, maxLength: 0 }}    | ${{ inputType: 'text', expectedLength: { min: 10, max: 0 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 0, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 0, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 5, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 5, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: false, minLength: 10, maxLength: 10 }}   | ${{ inputType: 'text', expectedLength: { min: 10, max: 10 }, isRequired: false }}
      ${{ type: 'text', required: true, minLength: 0, maxLength: 0 }}      | ${{ inputType: 'text', expectedLength: { min: 0, max: 0 }, isRequired: true }}
      ${{ type: 'text', required: true, minLength: 20, maxLength: 10 }}    | ${{ inputType: 'text', expectedLength: { min: 10, max: 10 }, isRequired: true }}
    `(
      `should return $result when passed argument: $attrs`,
      ({ attrs, result }) => {
        expect(makeConstraintsOfInput(attrs)).toEqual(result)
      }
    )
  })

  describe('checkInputConstraints', () => {
    it.each`
      valueLength | expectedLength              | isRequired | isError  | result
      ${0}        | ${{ min: null, max: null }} | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: null, max: null }} | ${false}   | ${true}  | ${false}
      ${0}        | ${{ min: null, max: null }} | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: null, max: 0 }}    | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: null, max: 0 }}    | ${false}   | ${true}  | ${false}
      ${0}        | ${{ min: null, max: 0 }}    | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: 0, max: null }}    | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: 0, max: null }}    | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: 0, max: 0 }}       | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: 0, max: 0 }}       | ${false}   | ${true}  | ${false}
      ${0}        | ${{ min: 0, max: 0 }}       | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: null, max: 20 }}   | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: null, max: 20 }}   | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: 20, max: null }}   | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: 20, max: null }}   | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: 10, max: 30 }}     | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: 30, max: 10 }}     | ${false}   | ${false} | ${true}
      ${0}        | ${{ min: 10, max: 30 }}     | ${true}    | ${false} | ${false}
      ${0}        | ${{ min: 30, max: 10 }}     | ${true}    | ${false} | ${false}
      ${10}       | ${{ min: 10, max: 30 }}     | ${true}    | ${false} | ${true}
      ${10}       | ${{ min: 10, max: 30 }}     | ${true}    | ${true}  | ${false}
      ${10}       | ${{ min: 30, max: 10 }}     | ${true}    | ${false} | ${false}
      ${20}       | ${{ min: 10, max: 30 }}     | ${true}    | ${false} | ${true}
      ${20}       | ${{ min: 30, max: 10 }}     | ${true}    | ${false} | ${false}
      ${30}       | ${{ min: 10, max: 30 }}     | ${true}    | ${false} | ${true}
      ${30}       | ${{ min: 30, max: 10 }}     | ${true}    | ${false} | ${false}
      ${40}       | ${{ min: 10, max: 30 }}     | ${true}    | ${false} | ${false}
      ${40}       | ${{ min: 30, max: 10 }}     | ${true}    | ${false} | ${false}
      ${20}       | ${{ min: null, max: 10 }}   | ${false}   | ${false} | ${false}
      ${20}       | ${{ min: null, max: 20 }}   | ${false}   | ${false} | ${true}
      ${20}       | ${{ min: null, max: 30 }}   | ${false}   | ${false} | ${true}
      ${20}       | ${{ min: null, max: 30 }}   | ${false}   | ${true}  | ${false}
      ${20}       | ${{ min: 10, max: null }}   | ${false}   | ${false} | ${true}
      ${20}       | ${{ min: 20, max: null }}   | ${false}   | ${false} | ${true}
      ${20}       | ${{ min: 30, max: null }}   | ${false}   | ${false} | ${false}
    `(
      `should return $result when passed argument: ($valueLength, $expectedLength, $isRequired)`,
      ({ valueLength, expectedLength, isRequired, isError, result }) => {
        expect(
          checkConstraintsOfIinput({
            valueLength,
            expectedLength,
            isRequired,
            isError
          })
        ).toEqual(result)
      }
    )
  })
})
