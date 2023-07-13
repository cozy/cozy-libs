import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import flag from 'cozy-flags'

import PapersFabWrapper from './PapersFabWrapper'
import AppLike from '../../../test/components/AppLike'

jest.mock('cozy-flags')
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ qualificationLabel: '' })),
    useNavigate: jest.fn()
  }
})

const MockChild = ({ onClick }) => (
  <button onClick={onClick} data-testid="MockChild" />
)

const setup = ({
  withChild,
  withQualificationLabelParam,
  mockNavigate = jest.fn(),
  isFlag = true
} = {}) => {
  flag.mockReturnValue(isFlag)
  if (withQualificationLabelParam) {
    useParams.mockReturnValue({ qualificationLabel: 'tax_notice' })
  }

  useNavigate.mockImplementation(() => mockNavigate)

  return render(
    <AppLike>
      <PapersFabWrapper data-testid="PapersFabWrapper">
        {withChild && <MockChild />}
      </PapersFabWrapper>
    </AppLike>
  )
}

describe('PapersFabWrapper', () => {
  it('should not display if have not child', () => {
    const { queryByTestId } = setup({ withChild: false })

    expect(queryByTestId('PapersFabWrapper')).toBeNull()
  })

  it('should display a child', () => {
    const { getByTestId } = setup({ withChild: true })

    expect(getByTestId('MockChild'))
  })

  describe('On home page', () => {
    it('should navigate to the create modale if click on child', () => {
      const mockNavigate = jest.fn()
      const { getByTestId } = setup({
        withChild: true,
        mockNavigate
      })

      const btn = getByTestId('MockChild')
      fireEvent.click(btn)

      expect(mockNavigate).toBeCalledTimes(1)
      expect(mockNavigate).toBeCalledWith('create')
    })
  })

  describe('On papers list', () => {
    it('should not navigate to the create modale if click on child', () => {
      const mockNavigate = jest.fn()
      const { getByTestId } = setup({
        withChild: true,
        withQualificationLabelParam: true,
        mockNavigate
      })

      const btn = getByTestId('MockChild')
      fireEvent.click(btn)

      expect(mockNavigate).toBeCalledTimes(0)
    })
    it('should display ActionMenuWrapper with additionnal action if click on child', () => {
      const { getByTestId, getByText } = setup({
        withChild: true,
        withQualificationLabelParam: true
      })

      const btn = getByTestId('MockChild')
      fireEvent.click(btn)

      expect(getByText('Add a paper')).toBeInTheDocument()
      expect(getByText('Add: Tax notice')).toBeInTheDocument()
    })
  })
})
