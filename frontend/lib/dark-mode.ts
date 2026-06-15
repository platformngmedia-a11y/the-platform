export type DarkModePreference = 'light' | 'dark' | 'system'

const DARK_MODE_KEY = 'theplatform_dark_mode'

export function getDarkModePreference(): DarkModePreference {
  if (typeof window === 'undefined') return 'system'

  try {
    const saved = localStorage.getItem(DARK_MODE_KEY) as DarkModePreference
    return saved || 'system'
  } catch {
    return 'system'
  }
}

export function setDarkModePreference(preference: DarkModePreference) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(DARK_MODE_KEY, preference)
    applyDarkMode(preference)
  } catch (error) {
    console.error('Failed to set dark mode preference:', error)
  }
}

export function applyDarkMode(preference: DarkModePreference) {
  if (typeof window === 'undefined') return

  const isDark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function subscribeToSystemPreference(callback: (isDark: boolean) => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches)
  }

  mediaQuery.addEventListener('change', handleChange)

  return () => mediaQuery.removeEventListener('change', handleChange)
}
