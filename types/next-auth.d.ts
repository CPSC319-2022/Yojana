// noinspection ES6UnusedImports
// This file is required to make NextAuth work with TypeScript by extending the NextAuth types with our own custom types

import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      isAdmin: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    isAdmin: boolean
  }
}
