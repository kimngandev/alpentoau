// frontend/pages/_app.tsx

import '../styles/globals.css'
import type { AppProps } from 'next/app'
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
