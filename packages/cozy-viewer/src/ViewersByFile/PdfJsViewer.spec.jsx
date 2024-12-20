import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'
import { Document } from 'react-pdf'

import { PdfJsViewer } from './PdfJsViewer'

jest.mock('../NoViewer/DownloadButton', () => () => (
  <div data-testid="dl-btn-no-viewer">DownloadButton</div>
))

jest.mock('react-pdf', () => ({
  Document: jest.fn(),
  Page: jest.fn(() => <div>Page</div>)
}))

describe('PDFViewer', () => {
  const setup = ({ file = {}, onLoadErrorMock } = {}) => {
    Document.mockImplementation(
      ({ children, onLoadError = onLoadErrorMock }) => {
        onLoadErrorMock && onLoadError()

        return <div>{children}</div>
      }
    )
    const defaultProps = { url: 'fake', file, t: x => x }
    return render(<PdfJsViewer {...defaultProps} />)
  }
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render a fallback component', () => {
    const onLoadErrorMock = jest.fn()
    const { getByTestId, queryByTestId } = setup({ onLoadErrorMock })

    const DownloadBtnNoViewer = getByTestId('dl-btn-no-viewer')
    const pdfjsNoViewer = getByTestId('no-viewer')
    const pdfjsViewer = queryByTestId('pdfjs-viewer')

    expect(pdfjsViewer).toBeNull()
    expect(DownloadBtnNoViewer).toBeInTheDocument()
    expect(pdfjsNoViewer).toBeInTheDocument()
  })

  it('should not render the fallback component', () => {
    const { queryByTestId, getByTestId } = setup()

    const pdfjsViewer = getByTestId('pdfjs-viewer')
    const pdfjsNoViewer = queryByTestId('no-viewer')
    const DownloadBtnNoViewer = queryByTestId('dl-btn-no-viewer')

    expect(pdfjsViewer).toBeInTheDocument()
    expect(pdfjsNoViewer).toBeNull()
    expect(DownloadBtnNoViewer).toBeNull()
  })
})
