import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import CompositeHeaderImage from './CompositeHeaderImage'
import MockSVG from '../../assets/icons/IlluGenericNewPage.svg'

const setup = ({ icon, fallbackIcon } = {}) => {
  return render(
    <CompositeHeaderImage
      icon={icon}
      fallbackIcon={fallbackIcon}
      iconSize="medium"
      title="Title"
      text="Text"
    />
  )
}

describe('CompositeHeaderImage', () => {
  it('should return nothing if icon & fallbackIcon props is undefined', () => {
    const { container } = setup()

    expect(container).toBeEmptyDOMElement()
  })

  it('should use fallbackIcon if icon is undefined', () => {
    const { getByTestId } = setup({
      fallbackIcon: MockSVG
    })

    expect(getByTestId('test-file-stub'))
  })

  it('should use fallback icon for not supported png', () => {
    const { getByTestId } = setup({
      icon: 'notSupported.png',
      fallbackIcon: 'fallback.svg'
    })

    expect(getByTestId('fallback.svg'))
  })

  it('should use png if supported', () => {
    const { getByTestId } = setup({ icon: 'IlluIBAN.png' })

    expect(getByTestId('test-file-stub'))
  })

  it('should return null if extension is not supported', () => {
    const { queryByTestId } = setup({ icon: 'IlluGenericInputDate.gif' })

    expect(queryByTestId('test-file-stub')).toBeNull()
  })
})
