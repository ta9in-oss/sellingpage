// Prints a fresh STORE_SECRET_KEY. Set the SAME value in two places:
//   wrangler pages secret put STORE_SECRET_KEY --project-name 7aba-platform
//   gh secret set STORE_SECRET_KEY
// Losing it makes every stored merchant token unreadable — see the runbook.
import { generateKey } from '../apps/platform/src/lib/secretBox.ts'

console.log(generateKey())
