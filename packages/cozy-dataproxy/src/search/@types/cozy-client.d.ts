import 'cozy-client'
import { CozyLink } from 'cozy-client'
import {
  CozyClientDocument,
  QueryOptions,
  QueryResult,
  ClientCapabilities
} from 'cozy-client/types/types'

declare module 'cozy-client' {
  interface ClientOptions {
    appMetadata?: AppMetadata
    autoHydrate?: boolean
    backgroundFetching?: boolean
    capabilities?: ClientCapabilities
    client?: object
    link?: object
    links?: object
    oauth?: object
    onError?: (...args: unknown[]) => unknown
    onTokenRefresh?: (...args: unknown[]) => unknown
    schema?: object
    stackClient?: object
    store?: boolean
    token?: Token
    uri?: string
    warningForCustomHandlers?: boolean
  }

  interface OAuthOptions {
    clientID: string
    clientName: string
    clientSecret: string
  }

  interface AccessToken {
    token_type: string
    access_token: string
    accessToken?: string
    refresh_token: string
    scope: string
  }

  interface AccessToken {
    token_type: string
    access_token: string
    accessToken?: string
    refresh_token: string
    scope: string
  }

  interface AppToken {
    token: string
  }

  interface LoginFlagshipParams {
    passwordHash: string
    twoFactorToken?: string
    twoFactorPasscode?: string
  }

  interface LoginFlagship2faNeededResult {
    two_factor_token: string
  }

  interface FlagshipVerificationNeededResult {
    session_code: string
  }

  type LoginFlagshipResult =
    | AccessToken
    | LoginFlagship2faNeededResult
    | FlagshipVerificationNeededResult

  interface SetPassphraseFlagshipParams {
    registerToken: string
    passwordHash: string
    hint: string
    iterations: number
    key: string
    publicKey: string
    privateKey: string
  }

  type SetPassphraseFlagshipResult =
    | AccessToken
    | FlagshipVerificationNeededResult

  interface StackClient {
    fetchJSON: <T>(method: string, path: string, body?: unknown) => Promise<T>
    fetchKonnectorToken: (slug: string) => Promise<string>
    fetchSessionCode: () => Promise<{ session_code: string }>
    getAuthorizationHeader: () => string
    loginFlagship: (params: LoginFlagshipParams) => Promise<LoginFlagshipResult>
    oauthOptions: OAuthOptions
    register: (instance: string) => Promise<void>
    setToken: (token: AccessToken) => void
    setUri: (uri: string) => void
    token: AppToken
    uri: string
    setPassphraseFlagship: (
      params: SetPassphraseFlagshipParams
    ) => Promise<SetPassphraseFlagshipResult>
    updateInformation: (options: OAuthOptions) => Promise<OAuthOptions>
  }

  interface InstanceOptions {
    capabilities: {
      flat_subdomains: boolean
    }
    subdomain: 'flat' | 'nested'
    locale: string
  }

  export const useClient = (): CozyClient => CozyClient as CozyClient

  export interface SplitFilenameResult {
    filename: string
    extension: string
  }

  export interface FileCollectionGetResult {
    data: {
      _id: string
      _rev: string
      name: string
      path: string
      metadata?: {
        backupDeviceIds: string[]
      }
      attributes: {
        path: string
      }
    }
  }

  export interface StackErrors {
    errors: {
      status: string
      title: string
      detail: string
    }[]
  }

  interface Collection {
    findReferencedBy: (
      params: object
    ) => Promise<{ included: { attributes: unknown }[] }>
    createDirectoryByPath: (path: string) => Promise<FileCollectionGetResult>
    ensureDirectoryExists: (path: string) => Promise<string>
    getDirectoryOrCreate: (
      name: string,
      parentDirectory: object
    ) => Promise<FileCollectionGetResult>
    createFileMetadata: (metadata: object) => Promise<{ data: { id: string } }>
    addReferencesTo: (references: object, dirs: object[]) => Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    launch: (trigger: any) => any
  }

  export default class CozyClient {
    plugins: unknown
    constructor(rawOptions?: ClientOptions)
    getStackClient(): StackClient
    getInstanceOptions(): InstanceOptions
    instanceOptions: InstanceOptions
    collection(doctype: string): Collection
    isLogged: boolean
    on: (
      event: string,
      callback: (doctype: string) => void | Promise<void>
    ) => void
    removeListener: (event: string, callback: () => void) => void
    logout: () => Promise<void>
    query: (
      queryDefinition: QueryDefinition,
      options?: QueryOptions
    ) => Promise<QueryResult>
    queryAll: <T>(queryDefinition: QueryDefinition) => Promise<T>
    links: CozyLink[]
    capabilities: ClientCapabilities
    registerPlugin: (Plugin: () => void, options: unknown) => void
    getCollectionFromState: (type: string) => CozyClientDocument[]
  }
}
