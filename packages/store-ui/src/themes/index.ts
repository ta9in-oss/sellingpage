export * from './theme.types'
export * from './cssVars'
export * from './brutalist'
export * from './clean'
export * from './dark'

import { brutalistTheme } from './brutalist'
import { cleanTheme } from './clean'
import { darkTheme } from './dark'
import type { Theme } from './theme.types'

export const presets: Theme[] = [brutalistTheme, cleanTheme, darkTheme]
