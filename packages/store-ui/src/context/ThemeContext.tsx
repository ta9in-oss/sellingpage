import { createContext, useContext } from 'react'
import type { Theme } from '../themes/theme.types'
import { brutalistTheme } from '../themes/brutalist'

const ThemeContext = createContext<Theme>(brutalistTheme)
export const ThemeProvider = ThemeContext.Provider
export const useTheme = () => useContext(ThemeContext)
