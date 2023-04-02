import { Head, Html, Main, NextScript } from 'next/document'
/**
 * Document is a custom component that extends the base Next.js Document component. It provides a template for the application's HTML structure.
 * This component is server-rendered and only rendered once per request, making it suitable for setting up static HTML that does not need to be updated during the client-side lifecycle.
 * Key functionalities:
 * Setting the HTML language attribute to 'en' for better accessibility.
 * Rendering the Head component from 'next/head' for managing the document head content.
 * Rendering the Main component from 'next/document' that renders the actual page content.
 * Rendering the NextScript component from 'next/document' that injects Next.js scripts for client-side functionality.
 *
 * @returns {JSX.Element} The rendered Document component.
 */
const Document = () => {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
