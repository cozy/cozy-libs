import React from 'react'

import { CompletedFromMyselfStatus } from './CompletedFromMyselfStatus'

const fakeT = (msgId, args) => {
  return `${msgId} ${JSON.stringify(args)}`
}

describe('CompletedFromMyselfStatus component', () => {
  it('should display nothing if no data is filled', () => {
    const component = shallow(
      <CompletedFromMyselfStatus completed={0} total={10} t={fakeT} />
    ).getElement()
    expect(component).toBeNull()
  })

  it('should display a status if there are some completed data', () => {
    const component = mount(
      <CompletedFromMyselfStatus completed={5} total={10} t={fakeT} />
    )
    expect(component).toMatchSnapshot()
  })
})
