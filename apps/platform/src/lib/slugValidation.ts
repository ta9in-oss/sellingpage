// apps/platform/src/lib/slugValidation.ts

const RESERVED_SLUGS = [
  'www', 'app', 'api', 'admin', 'dashboard', 'platform',
  'blog', 'help', 'support', 'mail', 'static', 'assets', '7aba',
]

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{2,30}$/

export interface SlugValidationResult {
  valid: boolean
  error?: string
}

export function validateSlug(slug: string): SlugValidationResult {
  if (!slug) return { valid: false, error: 'الاسم مطلوب' }
  if (RESERVED_SLUGS.includes(slug)) return { valid: false, error: 'هذا الاسم محجوز' }
  if (!SLUG_PATTERN.test(slug)) {
    return {
      valid: false,
      error: 'يجب أن يكون الاسم من 3 إلى 31 حرفاً، أحرف صغيرة وأرقام وشرطة فقط، ويبدأ بحرف أو رقم',
    }
  }
  return { valid: true }
}
