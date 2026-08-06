/**
 * Stock, in one place.
 *
 * A store used to be created with `stock: 0`, and the order flow rejected any
 * order larger than stock — so every freshly deployed store refused its first
 * order with "الكمية المطلوبة غير متوفرة في المخزون" until the merchant found
 * the dashboard field. That is a silent revenue hole, and the merchant has no
 * reason to expect it.
 *
 * So stock is now explicitly *opt-in*. A store either tracks units or it does
 * not, and not tracking is the default. When tracking is off, nothing about
 * quantity is ever enforced or shown — it is the merchant's shop and their
 * call.
 *
 * `track_stock` is the flag. Because InstantDB is schemaless, rows written
 * before it existed simply lack it, so `undefined` needs a meaning:
 *
 *   - `true`      → tracked
 *   - `false`     → not tracked, unlimited
 *   - `undefined` → tracked only if a positive stock was already stored
 *
 * That last rule is what makes this safe to ship onto live stores. A merchant
 * who had deliberately set "20 units" keeps their limit, while a store still
 * sitting at the never-configured 0 stops turning buyers away. The ambiguity
 * only lasts until someone touches the dashboard toggle, which always writes
 * the flag explicitly.
 */

/** Anything with the two fields we care about. Loose, because rows are schemaless. */
export interface StockRow {
  stock?: unknown
  track_stock?: unknown
}

export interface StockState {
  /** Whether unit counts are enforced and shown to buyers at all. */
  tracked: boolean
  /** Units on hand. Meaningless when `tracked` is false. */
  units: number
}

function toUnits(value: unknown): number {
  const n = Math.floor(Number(value))
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function resolveStock(row?: StockRow | null): StockState {
  if (!row) return { tracked: false, units: 0 }

  const units = toUnits(row.stock)
  if (row.track_stock === true) return { tracked: true, units }
  if (row.track_stock === false) return { tracked: false, units }

  // Legacy row, flag never written — infer from whether stock was ever set.
  return { tracked: units > 0, units }
}

/** Can this order be accepted? Untracked stores accept any quantity. */
export function hasEnoughStock(state: StockState, quantity: number): boolean {
  return !state.tracked || state.units >= quantity
}

/**
 * What the storefront should cap quantity at. `null` means "no cap" and is what
 * suppresses the "N left in stock" scarcity line — an untracked store must not
 * imply a number it isn't keeping.
 */
export function stockCap(state: StockState): number | null {
  return state.tracked ? state.units : null
}
