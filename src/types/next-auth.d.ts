import { KeycloakProfile } from 'next-auth/providers/keycloak'

// Augment the JWT to hold the tokens and profile
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    access_token?: string
    refresh_token?: string
    id_token?: string
    profile: KeycloakProfile
    access_token_expired: number
    refresh_token_expired: number
  }
}

// Augment the KeyCloakProfile to add more properties (the default version will contain only default properties)
declare module 'next-auth/providers/keycloak' {
  interface KeycloakProfile {
    position: string
    roles: string[]
  }
}

// Augment the session to hold the tokens and profile
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string
    refresh_token?: string
    id_token?: string
    profile: KeycloakProfile
    error?: any
  }

  /** Augment Account login NextAuth  */
  interface Account {
    refresh_expires_in: number
  }
}
