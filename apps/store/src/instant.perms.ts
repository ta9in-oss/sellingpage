// instant.perms.ts
import type { InstantRules } from '@instantdb/react';

const rules = {
  // Built-in users table - users can view their own data
  $users: {
    allow: {
      view: "auth.id == data.id",
      create: "false",
      update: "false", 
      delete: "false"
    }
  },
  
 
} satisfies InstantRules;

export default rules;