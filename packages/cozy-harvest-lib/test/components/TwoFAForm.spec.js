/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import Button from 'cozy-ui/react/Button'

import { TwoFAForm } from 'components/TwoFAForm'

const t = jest.fn().mockImplementation(key => key)

const accountFixture = {}

describe('TwoFAForm', () => {
  it('should render correctly with value change', () => {
    const mockChangeEvent = {
      currentTarget: {
        value: 'Cozy2FA'
      }
    }
    const component = shallow(<TwoFAForm t={t} account={accountFixture} />)
    component.instance().handleChange(mockChangeEvent)
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should have busy button state and disabled if submitting', () => {
    const component = shallow(<TwoFAForm t={t} submitting />)
    const submitButton = component.find(Button)
    expect(submitButton.getElement()).toMatchSnapshot()
  })

  it('should handle code submit', () => {
    const mockCode = 'Cozy2FA'
    const handleSubmitTwoFACodeMock = jest.fn()
    const component = shallow(
      <TwoFAForm t={t} handleSubmitTwoFACode={handleSubmitTwoFACodeMock} />
    )
    component.setState({ twoFACode: mockCode })
    const form = component.find('form')
    form.simulate('submit', { preventDefault: jest.fn() })
    expect(handleSubmitTwoFACodeMock).toHaveBeenCalled()
    expect(handleSubmitTwoFACodeMock).toHaveBeenCalledWith(mockCode)
  })
})
