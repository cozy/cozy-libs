import React from 'react'

import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
import Typography from 'cozy-ui/transpiled/react/Typography'

/**
 * @param {object} param
 * @param {{ end: string, start: string }} param.adornment - Adornment object
 * @param {number} param.smartcount - Value for determining text pluralization
 * @param {Function} param.t - Translation function
 * @returns {{ endAdornment?: JSX.Element, startAdornment?: JSX.Element }}
 */
export const makeInputAdornment = ({ adornment, smartcount, t }) => {
  const result = {}
  Object.entries(adornment).map(([adornmentPosition, adornmentValue]) => {
    if (!['start', 'end'].includes(adornmentPosition)) return

    result[`${adornmentPosition}Adornment`] = (
      <InputAdornment position={adornmentPosition}>
        <Typography>
          {t(adornmentValue, { smart_count: smartcount })}
        </Typography>
      </InputAdornment>
    )
  })
  return result
}
