export * from './theme.types'
export * from './brutalist'
export * from './acquisition'
export * from './warm'

import { brutalistTheme } from './brutalist'
import { acquisitionTheme } from './acquisition'
import { warmTheme } from './warm'
import type { Theme } from './theme.types'

export const presets: Theme[] = [brutalistTheme, acquisitionTheme, warmTheme]
