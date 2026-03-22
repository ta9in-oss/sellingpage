import { init } from '@instantdb/react';
import schema from '../instant.schema';

const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID!,
  schema,
});

export { db };