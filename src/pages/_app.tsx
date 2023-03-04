import { wrapper } from '@/redux/store'
import '@/styles/globals.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'

type AuthProps = {
  children: React.ReactNode
}

const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  return (
    <SessionProvider session={props.session}>
      <Head>
        <title>Yojana</title>
        <meta name='description' content='Yojana is a calendar app built with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Provider store={store}>
        <Auth>
          <Component {...props.pageProps} />
        </Auth>
      </Provider>
    </SessionProvider>
  )
  function Auth({ children }: AuthProps) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user
    React.useEffect(() => {
      if (status === 'loading') return // Do nothing while loading
    }, [isUser, status])

    if (isUser) {
      return <>{children}</>
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>
  }
}

export default App
