import { useEffect } from 'react'
import { db } from '@/lib/instantdb'

/** Real concurrent-visitor count via InstantDB presence — not simulated. */
export function useOnlinePresence() {
  const room = db.room('platformPresence', 'main')
  const { peers, publishPresence } = db.rooms.usePresence(room)

  useEffect(() => {
    publishPresence({})
  }, [publishPresence])

  // peers excludes self, so the visible visitor counts as +1.
  return Object.keys(peers).length + 1
}
