import React from 'react'

import { CompletedFromDriveStatus } from './CompletedFromDriveStatus'

const fakeT = (msgId, args) => {
  return `${msgId} ${JSON.stringify(args)}`
}

describe('CompletedFromDriveStatus component', () => {
  it('should display nothing if no document has been gathered', () => {
    const component = shallow(
      <CompletedFromDriveStatus completed={0} total={10} t={fakeT} />
    ).getElement()
    expect(component).toBeNull()
  })

  it('should display a status if there are some completed documents', () => {
    const component = mount(
      <CompletedFromDriveStatus completed={5} total={10} t={fakeT} />
    )
    expect(component).toMatchSnapshot()
  })
})
