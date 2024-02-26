import { render } from '@testing-library/react'
import React from 'react'

import { ShareButton } from './ShareButton'

jest.mock('cozy-ui/transpiled/react/Button', () => ({
  Button: props => {
    if (props.t || props.t || props.lang) {
      throw 'do not pass html button invalid props'
    }
    return <></>
  }
}))

jest.mock('cozy-ui/transpiled/react/providers/I18n', () => ({
  useI18n: jest.fn().mockReturnValue({ t: jest.fn() })
}))

jest.mock('./hoc/withLocales', () =>
  // eslint-disable-next-line react/display-name
  Component => props => <>{Component(props)}</>
)

jest.mock('./context', () => ({
  // eslint-disable-next-line react/display-name
  Consumer: props => {
    const Component = () => props.children({ byDocId: { docId: false } })
    return <Component />
  }
}))

describe('ShareButton', () => {
  it('should not send incorrect props to CozyUI button', () => {
    // When
    const { container } = render(
      <ShareButton
        f="incorrect prop"
        t="incorrect prop"
        lang="incorrect prop"
      />
    )

    // Then
    expect(container).toBeDefined()
  })
})
