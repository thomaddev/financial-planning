import {  getServerSession } from 'next-auth'
import {AuthOptions} from "next-auth"
import KeycloakProvider from 'next-auth/providers/keycloak'
import { JWT } from 'next-auth/jwt'

const clientId = process.env.KEYCLOAK_CLIENT_ID ?? ''
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? ''
const issuer = process.env.KEYCLOAK_ISSUER ?? ''

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    KeycloakProvider({
      clientId,
      clientSecret,
      issuer,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the access token to the token object if it exists
      if (token.access_token && token.access_token_expired) {
        // Check if the token is close to expiring (e.g., less than 5 minutes remaining)
        if (Date.now() > (token.access_token_expired - 5 * 60 * 1000)) {
          // Attempt to refresh the token
          token = await refreshAccessToken(token);
        }
      }
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.access_token_expired = (account.expires_at ?? 0) * 1000;
        token.access_token_expired = Date.now() + (account.refresh_expires_in ?? 0) * 1000; // Refresh token expiration
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token; // Pass refreshed access token to session
      session.error = token.error; // Handle any refresh errors
      return session;
    },
  },
}

const refreshAccessToken = async (token: JWT) => {
  try {
    if (Date.now() > token.refresh_token_expired) {
      throw Error
    }
    const details = {
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token
    }
    const formBody: string[] = []
    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(value)
      formBody.push(encodedKey + '=' + encodedValue)
    })
    const formData = formBody.join('&')
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    const refreshedTokens = await response.json()
    if (!response.ok) throw refreshedTokens
    return {
      ...token,
      access_token: refreshedTokens.access_token,
      access_token_expired: Math.floor(Date.now() + refreshedTokens.expires_in * 1000),
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      refresh_token_expired: Math.floor(Date.now() + (refreshedTokens.refresh_expires_in ?? 0) * 1000),
    }
  } catch (_) {
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}


/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }

// export default NextAuth(authOptions)
