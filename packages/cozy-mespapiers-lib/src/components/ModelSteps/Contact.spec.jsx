'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from 'test/components/AppLike'
import Contact from 'src/components/ModelSteps/Contact'
import { FormDataProvider } from 'src/components/Contexts/FormDataProvider'

const mockCurrentStep = { illustration: 'illu.svg', text: 'text of step' }

const setup = () => {
  const client = {
    collection: jest.fn(() => ({
      findMyself: jest.fn(() => ({ data: [{ fullname: 'Bob' }] }))
    }))
  }
  return render(
    <AppLike client={client}>
      <FormDataProvider>
        <Contact currentStep={mockCurrentStep} />
      </FormDataProvider>
    </AppLike>
  )
}

describe('PaperLine components:', () => {
  it('should be rendered correctly', () => {
    const { container } = setup()

    expect(container).toBeDefined()
  })

  it('should display "text of step"', () => {
    const { getByText } = setup()

    expect(getByText('text of step'))
  })

  it('should display "Someone else"', () => {
    const { getByText } = setup()

    expect(getByText('Someone else'))
  })

  it('should display "Save"', () => {
    const { getByText } = setup()

    expect(getByText('Save'))
  })
})
