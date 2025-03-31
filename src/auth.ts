import { getServerSession } from 'next-auth'
import { AuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from 'next-auth/jwt'

// Define custom types
interface CustomUser {
  id: string
  name: string
  email: string
  role: string
  access_token: string
}

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
    access_token?: string
  }
}

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        // Mock authentication
        if (credentials?.username === "admin" && credentials?.password === "hiadmin") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            access_token: "mock-access-token",
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role
        token.access_token = (user as CustomUser).access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.access_token = token.access_token as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }

// export default NextAuth(authOptions)
