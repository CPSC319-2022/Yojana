//  This file is used to define types for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    DB_URL: string
    AZURE_AD_CLIENT_ID: string
    AZURE_AD_CLIENT_SECRET: string
    AZURE_AD_TENANT_ID: string
    AZURE_AD_ADMIN_GROUP_ID: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string
  }
}
