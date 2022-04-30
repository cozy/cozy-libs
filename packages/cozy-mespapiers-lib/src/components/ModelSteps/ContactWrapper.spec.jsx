'use strict'
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from '../../../test/components/AppLike'
import ContactWrapper from './ContactWrapper'
import { FormDataProvider } from '../Contexts/FormDataProvider'

const mockCurrentStep = { illustration: 'Account.svg', text: 'text of step' }

const setup = () => {
  const client = {
    collection: jest.fn(() => ({
      findMyself: jest.fn(() => ({ data: [{ fullname: 'Bob' }] }))
    }))
  }
  return render(
    <AppLike client={client}>
      <FormDataProvider>
        <ContactWrapper currentStep={mockCurrentStep} />
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
