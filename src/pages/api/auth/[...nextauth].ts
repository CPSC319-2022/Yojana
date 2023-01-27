import NextAuth, { type NextAuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { MicrosoftAuthProvider } from '@/utils/msGraph/MicrosoftAuthProvider'
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client'
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types'
import * as process from 'process'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        let clientOptions: ClientOptions = {
          authProvider: new MicrosoftAuthProvider(account.access_token)
        }
        const client = Client.initWithMiddleware(clientOptions)
        try {
          const userGroups: MicrosoftGraph.Group[] = (await client.api('/me/memberOf').get()).value
          const adminGroup = userGroups.find((group) => group.id === process.env.AZURE_AD_ADMIN_GROUP_ID)
          token.isAdmin = !!adminGroup
        } catch (error) {
          throw error
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.isAdmin = token.isAdmin || false
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
