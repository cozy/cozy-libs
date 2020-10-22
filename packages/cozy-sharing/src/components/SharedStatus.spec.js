import React from 'react'
import { mount } from 'enzyme'
import { SharedStatus } from './SharedStatus'
import AppLike from '../../test/AppLike'
describe('SharedStatus component', () => {
  const WrappingComponent = ({ children }) => <AppLike>{children}</AppLike>

  it('should just render a span if no sharing', () => {
    const component = mount(<SharedStatus docId="1" recipients={[]} />, {
      wrappingComponent: WrappingComponent
    })
    expect(component).toMatchSnapshot()
  })

  it('should have the right display if there is several recipients', () => {
    const component = mount(
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
      />,
      {
        wrappingComponent: WrappingComponent
      }
    )
    expect(component).toMatchSnapshot()
  })

  it('should display the link if there is a link', () => {
    const component = mount(
      <SharedStatus docId="1" recipients={[]} link={true} />,
      {
        wrappingComponent: WrappingComponent
      }
    )
    expect(component).toMatchSnapshot()
  })
})
