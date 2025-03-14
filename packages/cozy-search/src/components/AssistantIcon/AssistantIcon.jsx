import React from 'react'

/**
 * The assistant's icon cannot be a SVG because it uses some conical gradients.
 *
 * Also we don't want to embed it as a PNG resource for now because we encounter some issues
 * in the Flagship app's WebViews when loaded in offline mode (the cache control seems not
 * to work after an app's restart).
 *
 * To fix those issues, we chose to embed the icon PNG as a base64 string until we find a
 * better solution.
 *
 * Base64 string generated using https://base64.guru/converter/encode/image/png
 */
export const AssistantIcon = ({ height, width, style, ...restProps }) => {
  return (
    <img
      src="data:image/png;base64,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"
      width={width}
      height={height}
      style={style}
      {...restProps}
    />
  )
}
