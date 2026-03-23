// apps/platform/src/instant.schema.ts
import { i } from '@instantdb/react'

const schema = i.schema({
  entities: {
    platformUsers: i.entity({
      email: i.string().unique().indexed(),
      tier: i.string(),
      purchasedAt: i.date(),
    }),
    stores: i.entity({
      userId: i.string().indexed(),
      slug: i.string().unique().indexed(),
      config: i.json(),
      status: i.string().indexed(),
      cfAccountId: i.string(),
      instantAppId: i.string(),
      deployedUrl: i.string(),
      lastDeployAt: i.date(),
      deployLog: i.string(),
    }),
  },
})

export default schema
export type AppSchema = typeof schema
