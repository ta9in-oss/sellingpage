export * from './theme.types'
export * from './cssVars'
export * from './brutalist'
export * from './clean'
export * from './dark'

import { brutalistTheme } from './brutalist'
import type { Theme } from './theme.types'

/**
 * Only the base (brutalist) theme is offered. The clean/dark presets are kept as
 * modules (still exported above) but removed from the picker: they rewired whole
 * layouts and the dark one hid the pricing tags. Merchants restyle by editing the
 * base theme's colours instead — which the sections honour via `useTheme()`.
 */
export const presets: Theme[] = [brutalistTheme]
