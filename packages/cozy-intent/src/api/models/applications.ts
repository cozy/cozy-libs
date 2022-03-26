import { WebviewService } from '../../api'

/** App's description resulting of its manifest.webapp file */
export interface AppManifest {
  /** The app's slug */
  slug: string

  /** The app's mobile information */
  mobile: AppManifestMobileInfo
}

/** App's mobile information. Used to describe the app scheme and its store urls */
export interface AppManifestMobileInfo {
  /** The app's URL scheme */
  schema: string

  /** The app's id on Google PlayStore */
  id_playstore: string

  /** The app's id on Apple AppStore */
  id_appstore: string
}

export interface CozyBar {
  bar?: {
    setWebviewContext?: (webviewContext: WebviewService) => void
  }
}

export interface FlagshipUI {
  /** Has to be a <color> CSS data type */
  bottomBackground?: string
  /** Has to be 'rgba(R, G, B[, A])' to enable, 'transparent' to disable */
  bottomOverlay?: string
  bottomTheme?: 'dark' | 'light'
  /** Has to be a <color> CSS data type */
  topBackground?: string
  /** Has to be 'rgba(R, G, B[, A])' to enable, 'transparent' to disable */
  topOverlay?: string
  topTheme?: 'dark' | 'light'
}
