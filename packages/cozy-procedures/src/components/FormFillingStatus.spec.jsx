import React from 'react'

import { FormFillingStatus } from './FormFillingStatus'

const fakeT = (msgId, args) => {
  return `${msgId} ${JSON.stringify(args)}`
}

describe('FormFillingStatus component', () => {
  it('should display nothing if no data is filled', () => {
    const component = shallow(
      <FormFillingStatus completed="0" total="10" t={fakeT} />
    ).getElement()
    expect(component).toBeNull()
  })

  it('should display a status if there are some completed data', () => {
    const component = mount(
      <FormFillingStatus completed="5" total="10" t={fakeT} />
    )
    expect(component).toMatchSnapshot()
  })
})
