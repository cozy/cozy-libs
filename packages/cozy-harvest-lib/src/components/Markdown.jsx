import React from 'react'
import ReactMarkdown from 'react-markdown'

export const reactMarkdownRendererOptions = {
  // eslint-disable-next-line react/display-name
  paragraph: props => <span className="u-db u-mv-0">{props.children}</span>
}

export var Markdown = ({ source }) => (
  <ReactMarkdown
    source={source}
    linkTarget="_blank"
    renderers={reactMarkdownRendererOptions}
  />
)

export default Markdown
