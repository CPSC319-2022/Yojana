import { wrapper } from '@/redux/store'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
/**
 * App is the main component that wraps the entire application, handling global styles, session management, and Redux state.
 * It uses the 'next-auth' library to manage user sessions, provides the Redux store to child components, and sets the application's meta data and title.
 * The App component receives the Component prop, which represents the actual page being rendered, and any additional props passed to it.
 * Key functionalities:
 * Setting the application's title and meta data using the Head component from 'next/head'.
 * Providing user session management through the SessionProvider from 'next-auth/react'.
 * Wrapping the application with the Redux store using the Provider component from 'react-redux'.
 * Rendering the appropriate page component (Component) received from the Next.js framework.
 *
 * @param {Object} props - The properties for the App component.
 * @param {React.ComponentType} props.Component - The page component being rendered.
 * @param {Object} props.pageProps - The properties passed to the page component.
 * @param {Object} props.session - The user session object from 'next-auth/react'.
 * @returns {JSX.Element} The rendered App component.
 */
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
