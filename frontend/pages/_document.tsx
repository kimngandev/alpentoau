// frontend/pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          {/* Remix Icon CSS */}
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
