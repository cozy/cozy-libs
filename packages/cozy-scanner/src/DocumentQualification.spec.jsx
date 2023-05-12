import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import flag from 'cozy-flags'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

import { DocumentQualification } from './DocumentQualification'

const MockDate = require('mockdate')
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
jest.mock('cozy-flags')
// Popper does not work well inside of jest as it heavily relies on DOM APIs (see https://github.com/popperjs/popper-core/issues/478).
jest.mock('@material-ui/core/Popper', () => {
  return ({ children }) => children
})

const MOCKED_DATE = '2019-01-01'

const setup = ({
  isFlag = false,
  onDescribed = jest.fn(),
  onFileNameChanged = jest.fn()
} = {}) => {
  flag.mockReturnValue(isFlag)
  return render(
    <MuiCozyTheme>
      <DocumentQualification
        allowEditFileName={true}
        onDescribed={onDescribed}
        onFileNameChanged={onFileNameChanged}
        title="Edit"
        t={text => text}
      />
    </MuiCozyTheme>
  )
}
describe('DocumentQualification', () => {
  beforeAll(() => {
    MockDate.set(MOCKED_DATE)
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Initial render + selection + filename', () => {
    const onDescribed = jest.fn()
    const onFileNameChanged = jest.fn()
    const { queryByText, getByText, asFragment, getByLabelText } = setup({
      isFlag: false,
      onDescribed,
      onFileNameChanged
    })
    expect(asFragment()).toMatchSnapshot()
    const undefinedItemNode = queryByText(/Scan.themes.undefined/i)
    const isSelected = undefinedItemNode.closest(
      '.grid-item__selected__without_label'
    )
    expect(Boolean(isSelected)).toBe(true)

    fireEvent.click(getByText('Scan.themes.family'))
    fireEvent.click(getByText('Scan.items.family_record_book'))
    expect(onDescribed).toBeCalledWith(
      {
        label: 'family_record_book',
        purpose: 'attestation',
        sourceCategory: 'gov',
        sourceSubCategory: 'civil_registration',
        subjects: ['family']
      },
      'Scan.items.family_record_book_2019-01-01.jpg'
    )
    const inputFileName = getByLabelText('Scan.filename')

    const familyItemNode = queryByText('Scan.themes.family')
    const familyItemNodeSelected = familyItemNode.closest(
      '.grid-item__selected'
    )
    expect(Boolean(familyItemNodeSelected)).toBe(true)
    expect(inputFileName.value).toBe('Scan.items.family_record_book_2019-01-01')
    expect(asFragment()).toMatchSnapshot()

    fireEvent.change(inputFileName, { target: { value: '' } })
    fireEvent.blur(inputFileName)

    expect(inputFileName.value).toBe('Scan.items.family_record_book_2019-01-01')

    fireEvent.change(inputFileName, { target: { value: 'Manual name' } })
    fireEvent.blur(inputFileName)
    expect(onFileNameChanged).toBeCalledWith('Manual name.jpg')

    fireEvent.click(familyItemNode)
    fireEvent.click(queryByText('Scan.items.birth_certificate'))
    expect(inputFileName.value).toBe('Manual name')
  })

  it('Hide health theme', () => {
    const { queryByText } = setup({ isFlag: true })

    expect(queryByText('Scan.themes.health')).toBeNull()
  })
})
