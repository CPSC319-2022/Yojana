// noinspection ES6UnusedImports

import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      name: string
      isAdmin: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name?: string
    email?: string
    isAdmin?: boolean
  }
}
