import { wrapper } from '@/redux/store'
import '@/styles/globals.css'
import '@/styles/print.css'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'

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
        <Component {...props.pageProps} />
      </Provider>
    </SessionProvider>
  )
}

export default App
