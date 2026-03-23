/** Tracks which fonts have already been injected */
const loadedFonts = new Set<string>()

/**
 * Dynamically injects a Google Fonts <link> for the given font name.
 * Idempotent — calling twice for the same font is a no-op.
 */
export function loadGoogleFont(fontName: string): void {
  const clean = fontName.split(',')[0].trim()
  if (!clean || loadedFonts.has(clean)) return
  const encoded = clean.replace(/ /g, '+')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;700;800&display=swap`
  document.head.appendChild(link)
  loadedFonts.add(clean)
}

export interface FontOption {
  name: string
  label: string
  script: 'arabic' | 'latin'
}

export const FONT_OPTIONS: FontOption[] = [
  // Arabic-first fonts
  { name: 'Almarai', label: 'Almarai — الماري', script: 'arabic' },
  { name: 'Cairo', label: 'Cairo — القاهرة', script: 'arabic' },
  { name: 'Tajawal', label: 'Tajawal — تجوال', script: 'arabic' },
  { name: 'Noto Sans Arabic', label: 'Noto Sans Arabic', script: 'arabic' },
  { name: 'Readex Pro', label: 'Readex Pro', script: 'arabic' },
  { name: 'IBM Plex Arabic', label: 'IBM Plex Arabic', script: 'arabic' },
  { name: 'Rubik', label: 'Rubik', script: 'arabic' },
  { name: 'Changa', label: 'Changa — شانجا', script: 'arabic' },
  { name: 'El Messiri', label: 'El Messiri — المسيري', script: 'arabic' },
  { name: 'Mada', label: 'Mada — مدى', script: 'arabic' },
  { name: 'Mirza', label: 'Mirza — ميرزا', script: 'arabic' },
  { name: 'Lateef', label: 'Lateef — لطيف', script: 'arabic' },
  { name: 'Amiri', label: 'Amiri — أميري', script: 'arabic' },
  { name: 'Reem Kufi', label: 'Reem Kufi — ريم كوفي', script: 'arabic' },
  // Latin/multilingual
  { name: 'Inter', label: 'Inter', script: 'latin' },
  { name: 'Poppins', label: 'Poppins', script: 'latin' },
  { name: 'Outfit', label: 'Outfit', script: 'latin' },
  { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', script: 'latin' },
  { name: 'DM Sans', label: 'DM Sans', script: 'latin' },
  { name: 'Space Grotesk', label: 'Space Grotesk', script: 'latin' },
]
