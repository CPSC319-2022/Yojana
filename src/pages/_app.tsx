import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { SSRProvider } from 'react-bootstrap'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SSRProvider>
      <Head>
        <title>Yojana</title>
        <meta name='description' content='Yojana is a calendar app built with Next.js' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SSRProvider>
  )
}

export default App
