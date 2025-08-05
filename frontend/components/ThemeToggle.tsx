
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'

export default function ThemeToggle() {
  const { t } = useTranslation('common')
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'light'|'dark' || 'light'
    setTheme(saved)
  }, [])

  
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  if (!mounted) return null
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label={t('aria.toggleTheme')}
    >
     {theme === 'light' 
        ? <i className="ri-moon-line text-xl"></i> 
        : <i className="ri-sun-line text-xl"></i>
      }
    </button>
  )
}
