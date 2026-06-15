'use client'

import { useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useDarkMode } from './DarkModeProvider'

export function DarkModeToggle() {
  const { isDark, preference, setPreference } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-paper dark:hover:bg-neutral-900 transition-colors"
        aria-label="Toggle dark mode"
        title="Theme"
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-line dark:border-neutral-700 z-50">
            <div className="p-2 space-y-1">
              {options.map(option => {
                const Icon = option.icon
                const isSelected = preference === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPreference(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                      isSelected
                        ? 'bg-navy text-white'
                        : 'text-ink dark:text-neutral-200 hover:bg-paper dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                    {isSelected && <span className="ml-auto text-xs">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
