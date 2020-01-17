import React from 'react'
import { mount } from 'enzyme'
import { SharedStatus } from './SharedStatus'
import AppLike from '../../test/AppLike'
describe('SharedStatus component', () => {
  it('should just render a span if no sharing', () => {
    const component = mount(
      <AppLike>
        <SharedStatus docId="1" recipients={[]} />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should have the right display if there is several recipients', () => {
    const component = mount(
      <AppLike>
        <SharedStatus
          docId="1"
          recipients={[
            {
              _id: 1,
              name: '1'
            },
            {
              _id: 2,
              name: '2'
            }
          ]}
          t={x => x}
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should display the link if there is a link', () => {
    const component = mount(
      <AppLike>
        <SharedStatus docId="1" recipients={[]} t={x => x} link={true} />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })
})
