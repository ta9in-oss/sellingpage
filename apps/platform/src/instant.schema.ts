// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    platformUsers: i.entity({
      email: i.string().unique().indexed(),
      name: i.string().optional(),
      tier: i.string().optional(),
      checkoutId: i.string().optional(),
      purchasedAt: i.date().optional(),
      createdAt: i.date().optional(),
      // Global deployment credentials — apply to all stores by default
      cfAccountId: i.string().optional(),
      cfApiToken: i.string().optional(),
      instantAppId: i.string().optional(),
      instantAdminToken: i.string().optional(),
    }),
    stores: i.entity({
      adminEmail: i.string().optional(),
      cfAccountId: i.string().optional(),
      cfApiToken: i.string().optional(),
      cfWorkerUrl: i.string().optional(),
      chargilyApiKey: i.string().optional(),
      config: i.any(),
      createdAt: i.date().optional(),
      deployedUrl: i.string().optional(),
      deployLog: i.string().optional(),
      instantAdminToken: i.string().optional(),
      instantAppId: i.string().optional(),
      lastDeployAt: i.date().optional(),
      name: i.string().optional(),
      ownerId: i.string().optional(),
      slug: i.string().unique().indexed(),
      status: i.string().indexed(),
      updatedAt: i.date().optional(),
      userId: i.string().indexed(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
