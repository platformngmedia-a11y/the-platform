'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getDarkModePreference, setDarkModePreference, applyDarkMode, subscribeToSystemPreference } from '@/lib/dark-mode'
import type { DarkModePreference } from '@/lib/dark-mode'

interface DarkModeContextType {
  isDark: boolean
  preference: DarkModePreference
  setPreference: (preference: DarkModePreference) => void
  toggle: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [preference, setPreferenceState] = useState<DarkModePreference>('system')
  const [mounted, setMounted] = useState(false)

  // Initialize dark mode on mount
  useEffect(() => {
    const pref = getDarkModePreference()
    setPreferenceState(pref)
    applyDarkMode(pref)

    // Update isDark state
    const isDarkMode = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)

    setMounted(true)
  }, [])

  // Subscribe to system preference changes
  useEffect(() => {
    if (preference !== 'system') return

    const unsubscribe = subscribeToSystemPreference((isDarkSystem) => {
      setIsDark(isDarkSystem)
      applyDarkMode('system')
    })

    return unsubscribe
  }, [preference])

  const setPreference = (newPref: DarkModePreference) => {
    setPreferenceState(newPref)
    setDarkModePreference(newPref)

    const isDarkMode = newPref === 'dark' || (newPref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)
  }

  const toggle = () => {
    const newPref: DarkModePreference = isDark ? 'light' : 'dark'
    setPreference(newPref)
  }

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <DarkModeContext.Provider value={{ isDark, preference, setPreference, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return context
}
