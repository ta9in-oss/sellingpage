/**
 * Arabic cardinal-number agreement for "تاجر" (merchant). MSA number/noun
 * rules, not a generic pluralizer:
 *   1        → تاجر            (word only, no digit)
 *   2        → تاجران           (word only, no digit)
 *   3–10     → <n> تجار         (plural noun)
 *   11+      → <n> تاجراً        (singular accusative tamyiz)
 * Verb agreement follows the same split (singular/dual/plural).
 */
export function merchantsAr(n: number): string {
  if (n === 1) return 'تاجر اشترك في 7aba'
  if (n === 2) return 'تاجران اشتركا في 7aba'
  if (n <= 10) return `${n} تجار اشتركوا في 7aba`
  return `${n} تاجراً اشترك في 7aba`
}
