import NextAuth, { type NextAuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { MicrosoftAuthProvider } from '@/utils/msGraph/MicrosoftAuthProvider'
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client'
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types'
import prisma from '@/lib/prismadb'

export const authOptions: NextAuthOptions = {
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
          const adminGroup = userGroups.value.find((group) => group.id === process.env.AZURE_AD_ADMIN_GROUP_ID)
          token.isAdmin = !!adminGroup
        } catch (error) {
          throw error
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id
      session.user.isAdmin = token.isAdmin
      session.user.email = token.email
      session.user.name = token.name
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
      return session
    }
  },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID || ''
    })
  ]
}

export default NextAuth(authOptions)
