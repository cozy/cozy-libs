import { WebviewService } from '../../api/services/WebviewService'

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

export enum NativeThemes {
  Dark = 'dark',
  Light = 'light'
}

export interface FlagshipUI {
  /** Has to be a valid React Native color string or will be ignored */
  statusBarBackground?: string
  statusBarIcons?: NativeThemes

  /** Has to be a valid React Native color string or will be ignored */
  navbarBackground?: string
  navbarIcons?: NativeThemes
}
