import { IOCozyApp } from 'cozy-client/types/types'
import flag from 'cozy-flags'

export const shouldKeepApp = (app: IOCozyApp): boolean => {
  const hiddenApps = flag<string[]>('apps.hidden') || []

  return !hiddenApps.includes(app.slug)
}
