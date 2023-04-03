import { ClientSafeProvider, getProviders, getSession, LiteralUnion, signIn } from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import { DEFAULT_CALLBACK_URL } from '@/constants/constants'
import Image from 'next/image'
import azure from '@/public/azure.svg'

interface LoginProps {
  providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
  callbackUrl: string
}

/**
 * Login page for Azure AD
 * @param providers - list of providers
 * @param callbackUrl - url to redirect to after login
 * @returns {JSX.Element}
 */
export const Login = ({ providers, callbackUrl }: LoginProps) => {
  return (
    <div className='flex h-screen items-center justify-center bg-neutral-900'>
      {Object.values(providers).map(
        (provider) =>
          provider.id === 'azure-ad' && (
            <div key={provider.name}>
              <button
                id='azure-ad-btn'
                className='flex items-center rounded-lg bg-gradient-to-r from-azure-300  to-azure-400 py-2 px-4 font-medium text-white hover:from-azure-400 hover:to-azure-500'
                onClick={() => signIn(provider.id, { callbackUrl: callbackUrl }, { prompt: 'login' })}
              >
                Sign in with {provider.name}
                <Image height={20} width={20} src={azure} alt='Azure' className='ml-2' />
              </button>
            </div>
          )
      )}
    </div>
  )
}

export default Login

/**
 * Get the providers and callbackUrl for the login page
 * @param context - context object
 */
export const getServerSideProps = async (context: any) => {
  const callbackUrl = context.query.callbackUrl || DEFAULT_CALLBACK_URL

  // If the user is already signed in, send them to the callback URL
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false
      }
    }
  }

  const providers = await getProviders()
  return {
    props: { providers, callbackUrl }
  }
}
