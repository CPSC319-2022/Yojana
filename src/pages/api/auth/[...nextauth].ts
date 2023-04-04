import NextAuth, { type NextAuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { MicrosoftAuthProvider } from '@/lib/msGraph/MicrosoftAuthProvider'
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client'
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types'
import prisma from '@/prisma/prismadb'

/**
 * NextAuth configuration
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        const clientOptions: ClientOptions = {
          authProvider: new MicrosoftAuthProvider(account.access_token)
        }
        const client = Client.initWithMiddleware(clientOptions)
        // Get user and user groups
        try {
          const promises: [
            Promise<MicrosoftGraph.User>,
            Promise<{ '@odata.context': string; '@odata.nextLink'?: string; value: MicrosoftGraph.Group[] }>
          ] = [client.api('/me').get(), client.api('/me/memberOf').get()]
          const [user, userGroups] = await Promise.all(promises)
          if (!user.id) {
            throw new Error('User id not found')
          }
          token.id = user.id
          token.email = token.email || user.mail || user.userPrincipalName || user.id
          token.name = token.name || user.displayName || user.mail || user.userPrincipalName || user.id
          // check if user is in admin group
          const adminGroup = userGroups.value.find((group) => group.id === process.env.AZURE_AD_ADMIN_GROUP_ID)
          token.isAdmin = !!adminGroup
        } catch (error) {
          throw error
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      if (!token.id) {
        return session
      }
      // Add properties to session object
      session.user.id = session.user.id || token.id
      session.user.isAdmin = session.user.isAdmin || token.isAdmin
      session.user.email = session.user.email || token.email
      session.user.name = session.user.name || token.name
      try {
        // Update user in database
        await prisma.user.upsert({
          where: {
            id: session.user.id
          },
          update: {
            name: session.user.name,
            email: session.user.email,
            isAdmin: session.user.isAdmin
          },
          create: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            isAdmin: session.user.isAdmin
          }
        })
      } catch (error) {
        // console.error(error)
      }
      return session
    }
  },
  providers: [
    // Azure AD provider
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID
    })
  ]
}

export default NextAuth(authOptions)
