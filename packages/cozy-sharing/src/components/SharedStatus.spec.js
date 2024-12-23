import { render } from '@testing-library/react'
import React from 'react'

import { SharedStatus } from './SharedStatus'
import AppLike from '../../test/AppLike'

describe('SharedStatus component', () => {
  it('should just render a span if no sharing', () => {
    const { container } = render(
      <AppLike>
        <SharedStatus docId="1" recipients={[]} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
  })

  it('should have the right display if there is several recipients', () => {
    const { container, getByText } = render(
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
        />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
    expect(getByText('2 members')).toBeTruthy()
  })

  it('should display the link if there is a link', () => {
    const { container, getByText } = render(
      <AppLike>
        <SharedStatus docId="1" recipients={[]} link={true} />
      </AppLike>
    )
    expect(container).toMatchSnapshot()
    expect(getByText('Shared by link')).toBeTruthy()
  })
})
