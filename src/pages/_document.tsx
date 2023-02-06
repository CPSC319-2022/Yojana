import { Head, Html, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html lang='en'>
      <Head>
        <link href={'/dist/output.css'} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
