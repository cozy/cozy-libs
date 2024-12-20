import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import { TextViewer, isMarkdown } from './TextViewer'

jest.mock('../NoViewer/DownloadButton', () => () => (
  <div data-testid="dl-btn-no-viewer">DownloadButton</div>
))

const client = {}

const mockText = jest.fn()
const mockFetch = responseText => async () => ({
  text: mockText.mockResolvedValue(responseText)
})

client.getStackClient = jest.fn().mockReturnValue({
  fetch: mockFetch('The content of my file')
})

const props = {
  client,
  url: 'https://foo.mycozy.cloud',
  file: {
    _id: '1',
    _type: 'io.cozy.files',
    name: 'My File'
  }
}

describe('isMarkdown function', () => {
  it('test markdown function', () => {
    const note = {
      name: 'My Note.cozy-note',
      type: 'file',
      metadata: {
        content: 'my prosemirror content',
        schema: '1',
        title: 'prosemirror title',
        version: '3'
      }
    }
    expect(isMarkdown({ mime: 'text/markdown' })).toBe(true)
    expect(isMarkdown({ name: 'text.md' })).toBe(true)
    expect(isMarkdown(note)).toBe(true)
    expect(isMarkdown({ name: 'text.txt' })).toBe(false)
  })
})

describe('TextViewer Component', () => {
  it('should display the loader ', () => {
    const { getByTestId } = render(<TextViewer {...props} />)
    expect(getByTestId('viewer-spinner')).toBeInTheDocument()
  })
  describe('TextViewer render method', () => {
    it('should render the loader when loading', () => {
      const { getByTestId } = render(<TextViewer {...props} />)
      expect(getByTestId('viewer-spinner')).toBeInTheDocument()
    })

    it('should render NoViewer component on error', async () => {
      const errorProps = {
        ...props,
        client: {
          ...props.client,
          getStackClient: jest.fn().mockReturnValue({
            fetch: jest.fn().mockRejectedValue(new Error('Fetch error'))
          })
        }
      }
      const { getByTestId } = render(<TextViewer {...errorProps} />)

      await waitFor(() => {
        const pdfjsNoViewer = getByTestId('no-viewer')
        expect(pdfjsNoViewer).toBeInTheDocument()
      })
    })

    it('should render MarkdownRenderer when file is markdown', async () => {
      const markdownProps = {
        ...props,
        file: {
          ...props.file,
          mime: 'text/markdown'
        }
      }
      const { findByText } = render(<TextViewer {...markdownProps} />)
      await waitFor(async () => {
        const element = await findByText('The content of my file')
        expect(element).toBeInTheDocument()
      })
    })

    it('should render PlainTextRenderer when file is not markdown', async () => {
      const plainTextProps = {
        ...props,
        file: {
          ...props.file,
          mime: 'text/plain'
        }
      }
      const { findByTestId } = render(<TextViewer {...plainTextProps} />)
      await waitFor(async () => {
        const element = await findByTestId('viewer-plaintext')
        expect(element).toBeInTheDocument()
      })
    })
  })
})
