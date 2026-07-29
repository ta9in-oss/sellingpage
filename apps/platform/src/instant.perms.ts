// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

/**
 * Storage ($files) defaults to *deny*, which blocks the builder's media library
 * uploads. Merchants are authenticated (Google / magic-code) before they reach
 * the builder, so any logged-in user may upload and manage files; store images
 * are public assets, so reads are open. All other entities keep Instant's
 * default-allow behaviour (governed server-side by the admin token).
 */
const rules = {
  $files: {
    allow: {
      view: "true",
      create: "auth.id != null",
      delete: "auth.id != null",
    },
  },
} satisfies InstantRules;

export default rules;
