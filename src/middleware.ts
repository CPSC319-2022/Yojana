export { default } from 'next-auth/middleware'

// matcher contains page routes that should be protected by authentication middleware
// https://next-auth.js.org/configuration/nextjs#middleware
export const config = { matcher: ['/', '/api/:path*'] }
