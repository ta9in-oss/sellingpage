import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    products: i.entity({
      product_number: i.string().unique(),
      name: i.string(),
      description: i.string(),
      price: i.number(),
      image: i.string(),
      stock: i.number(),
      is_available: i.boolean(),
      created_at: i.date(),
      updated_at: i.date(),
    }),
    orders: i.entity({
      order_number: i.string().unique(),
      customer_name: i.string(),
      customer_email: i.string(),
      customer_phone: i.number(),
      customer_address: i.string(),
      customer_wilaya: i.string(),
      customer_city: i.string(),
      quantity: i.number(), // Added quantity
      status: i.json(),
      total_amount: i.string(),
      created_at: i.date(),
      updated_at: i.date(),
    }),
  },
  links: {
    orderProduct: {
      forward: { on: "orders", has: "one", label: "product" },
      reverse: { on: "products", has: "many", label: "orders" },
    },
  },
  rooms: {
    // Room for real-time order notifications
    orderNotifications: {
      presence: i.entity({
        userId: i.string(),
      }),
      topics: {
        newOrder: i.entity({
          orderNumber: i.string(),
          customerWilaya: i.string(),
          quantity: i.number(),
          timestamp: i.string(),
        }),
      },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
