import React from 'react'
import ReactMarkdown from 'react-markdown'

export const reactMarkdownRendererOptions = {
  // eslint-disable-next-line react/display-name
  Link: props => (
    <a href={props.href} rel="noopener noreferrer" target="_blank">
      {props.children}
    </a>
  ),
  // eslint-disable-next-line react/display-name
  paragraph: props => <span className="u-db u-mv-0">{props.children}</span>
}

export const Markdown = ({ source }) => (
  <ReactMarkdown source={source} renderers={reactMarkdownRendererOptions} />
)

export default Markdown
