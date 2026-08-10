import { db } from '@/lib/instantdb'

/**
 * True once the signed-in visitor has a tier on platformUsers — i.e. they've
 * already bought. FOMO/urgency UI (the subscriber toast, the "N browsing now"
 * pill) exists to push people who haven't converted yet; showing it to
 * someone who already paid is just noise (or worse, buyer's-remorse bait).
 */
export function useIsPaidUser(): boolean {
  const { user } = db.useAuth()
  const { data } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null,
  )
  const tier = (data?.platformUsers as { tier?: string }[] | undefined)?.[0]?.tier
  return !!tier
}
