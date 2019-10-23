import React from 'react'
const MockDate = require('mockdate')
import { render, fireEvent } from '@testing-library/react'
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
}))
import { DocumentQualification } from './DocumentQualification'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

const MOCKED_DATE = '2019-01-01'

describe('DocumentQualification', () => {
  beforeAll(() => {
    MockDate.set(MOCKED_DATE)
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Inital render + selection + filename', () => {
    const onDescribed = jest.fn()
    const onFileNameChanged = jest.fn()
    const { queryByText, getByText, asFragment, getByLabelText } = render(
      <MuiCozyTheme>
        <DocumentQualification
          allowEditFileName={true}
          onDescribed={onDescribed}
          onFileNameChanged={onFileNameChanged}
          title={'Edit'}
          //initialSelected={{ itemId: 1, categoryLabel: 'Label1' }}
          t={text => text}
        />
      </MuiCozyTheme>
    )
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
        classification: 'identity_document',
        defaultTheme: 'theme2',
        id: '4',
        label: 'family_record_book',
        subClassification: 'family_record_book'
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
})
