'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
<NextThemesProvider
      {...props}
      defaultTheme="system" // Use system preference by default
      enableSystem={true} // Ensure system themes are respected
      attribute="class" // Add class-based theming for CSS
    >
      {children}
    </NextThemesProvider>
  )
}