// apps/platform/src/instant.schema.ts
import { i } from '@instantdb/react'

const schema = i.schema({
  entities: {
    platformUsers: i.entity({
      email: i.string().unique().indexed(),
      /** 'starter' | 'pro' | 'agency' — null/missing means no subscription */
      tier: i.string(),
      /** Chargily checkout ID that was verified for this purchase */
      checkoutId: i.string(),
      purchasedAt: i.date(),
    }),
    stores: i.entity({
      userId: i.string().indexed(),
      slug: i.string().unique().indexed(),
      config: i.json(),
      status: i.string().indexed(),
      cfAccountId: i.string(),
      instantAppId: i.string(),
      instantAdminToken: i.string(),  // admin token for merchant's InstantDB app
      adminEmail: i.string(),         // email of the store's first admin user
      chargilyApiKey: i.string(),     // Chargily Pay secret key (stored encrypted)
      deployedUrl: i.string(),
      lastDeployAt: i.date(),
      deployLog: i.string(),
    }),
  },
})

export default schema
export type AppSchema = typeof schema

