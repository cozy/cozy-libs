import React from 'react'
import ReactMarkdown from 'react-markdown'

import Link from 'cozy-ui/transpiled/react/Link'

const reactMarkdownRendererOptions = ({ linkProps }) => ({
  // eslint-disable-next-line react/display-name
  paragraph: props => <span className="u-db u-mv-0">{props.children}</span>,
  link: props => (
    <Link href={props.href} rel="noreferrer" target="_blank" {...linkProps}>
      {props.children}
    </Link>
  )
})

export const Markdown = ({ source, linkProps, ...props }) => (
  <ReactMarkdown
    {...props}
    source={source}
    linkTarget="_blank"
    renderers={reactMarkdownRendererOptions({ linkProps })}
  />
)

export default Markdown
