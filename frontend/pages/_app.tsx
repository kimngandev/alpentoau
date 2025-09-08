// frontend/pages/_app.tsx

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import App from 'next/app'
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../contexts/AuthContext'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext)
  const locale = appContext.ctx?.locale ?? 'vi'
  const i18nProps = await serverSideTranslations(locale, ['common'])
  return { ...appProps, pageProps: { ...appProps.pageProps, ...i18nProps } }
}
