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

/**
 * All the different colors are optional
 */
export interface FlagshipUI {
  /**
   * It will set the background color of the Navigation Bar (bottom bar with home/back buttons)
   * Has to be a <color> CSS data type
   */
  bottomBackground?: string
  /**
   * It will set the overlay background color of the Navigation Bar (bottom bar with home/back buttons)
   * Displayed above the bottomBackground
   * Has to be 'rgba(R, G, B[, A])' to enable, 'transparent' to disable
   * It should be the same value as your app overlay color if any
   */
  bottomOverlay?: string
  /**
   * It will set the Navigation bar icon theme (bottom bar with home/back buttons)
   * Has to be 'dark' or 'light', 'dark' will set the icons to black/dark grey, 'light' will set the icons to white/light grey
   * Don't use a 'dark' theme with a dark background color, and vice versa
   */
  bottomTheme?: 'dark' | 'light'
  /**
   * It will set the background color of the Status Bar (top bar in the phone OS with connectivity/time display)
   * Has to be a <color> CSS data type
   */
  topBackground?: string
  /**
   * It will set the overlay background color of the Status Bar (top bar in the phone OS with connectivity/time display)
   * Displayed above the topBackground
   * Has to be 'rgba(R, G, B[, A])' to enable, 'transparent' to disable
   * It should be the same value as your app overlay color if any
   */
  topOverlay?: string
  /**
   * It will set the Status bar (top bar in the phone OS with connectivity/time display) icon theme
   * Has to be 'dark' or 'light', 'dark' will set the icons to black/dark grey, 'light' will set the icons to white/light grey
   * Don't use a 'dark' theme with a dark background color, and vice versa
   */
  topTheme?: 'dark' | 'light'
}
