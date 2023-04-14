import { render } from '@testing-library/react'
import React from 'react'

import CompositeHeader from './CompositeHeader'
import AppLike from '../../../test/components/AppLike'

const mockStringTitle = 'String Title'
const mockStringText = 'String Text'
const MockComponentTitle = () => {
  return <div>Component Title</div>
}
const MockComponentText = ({ n }) => {
  return <div>Component Text {n}</div>
}

const setup = ({ text, title } = {}) => {
  return render(
    <AppLike>
      <CompositeHeader
        icon="IlluIBAN.png"
        fallbackIcon="fallback.svg"
        iconSize="medium"
        title={title}
        text={text}
      />
    </AppLike>
  )
}

describe('CompositeHeader', () => {
  it('should return string title', () => {
    const { getByText } = setup({ title: mockStringTitle })

    expect(getByText('String Title'))
  })

  it('should return string text', () => {
    const { getByText } = setup({ text: mockStringText })

    expect(getByText('String Text'))
  })

  it('should return Component title', () => {
    const { getByText } = setup({ title: <MockComponentTitle /> })

    expect(getByText('Component Title'))
  })

  it('should return Component text', () => {
    const { getByText } = setup({ text: <MockComponentText /> })

    expect(getByText('Component Text'))
  })

  it('should return Component text', () => {
    const { getByText } = setup({
      text: [
        <MockComponentText key={0} n={0} />,
        <MockComponentText key={1} n={1} />
      ]
    })

    expect(getByText('Component Text 0'))
    expect(getByText('Component Text 1'))
  })
})
