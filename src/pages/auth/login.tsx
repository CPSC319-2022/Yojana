import { ClientSafeProvider, getProviders, getSession, LiteralUnion, signIn } from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import { SiMicrosoftazure } from 'react-icons/si'
import { DEFAULT_CALLBACK_URL } from '@/constants/constants'

interface LoginProps {
  providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
  callbackUrl: string
}

export const Login = ({ providers, callbackUrl }: LoginProps) => {
  return (
    <div className='flex h-screen items-center justify-center bg-neutral-900'>
      {Object.values(providers).map(
        (provider) =>
          provider.id === 'azure-ad' && (
            <div key={provider.name}>
              <button
                className='flex items-center rounded-lg bg-blue-800 py-2 px-4 font-medium text-white hover:bg-blue-900'
                onClick={() => signIn(provider.id, { callbackUrl: callbackUrl })}
              >
                Sign in with {provider.name}
                <SiMicrosoftazure className='ml-2 text-lg' />
              </button>
            </div>
          )
      )}
    </div>
  )
}

export default Login

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
