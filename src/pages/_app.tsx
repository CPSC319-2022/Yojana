import '@/styles/globals.css'
import React from 'react'
import Head from 'next/head'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Yojana</title>
        <meta name='description' content='Yojana is a calendar app built with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  )
}

export default App
