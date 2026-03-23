import "dotenv/config";
import { init, id } from "@instantdb/admin";

const adminDb = init({
    appId: "9f5df703-c3dc-4cb7-9a9d-e3d3d6448bce",
    // Note: You'll need to add your admin token from InstantDB dashboard
    // Get it from: https://instantdb.com/dash?s=main&t=home&app=9f5df703-c3dc-4cb7-9a9d-e3d3d6448bce
    adminToken: process.env.INSTANT_ADMIN_TOKEN || "",
});

// Helper function to create timestamps
function hoursAgo(hours: number): number {
    return Date.now() - hours * 60 * 60 * 1000;
}

function daysAgo(days: number): number {
    return Date.now() - days * 24 * 60 * 60 * 1000;
}

// Test orders with various configurations
const testOrders = [
    // Recent orders (< 24 hours) from different wilayas
    {
        wilaya: "الجزائر",
        city: "الجزائر الوسطى",
        quantity: 2,
        created_at: hoursAgo(2), // 2 hours ago
    },
    {
        wilaya: "وهران",
        city: "وهران",
        quantity: 1,
        created_at: hoursAgo(5), // 5 hours ago
    },
    {
        wilaya: "قسنطينة",
        city: "قسنطينة",
        quantity: 3,
        created_at: hoursAgo(12), // 12 hours ago
    },

    // Older orders (> 24 hours) - these should be aggregated
    {
        wilaya: "الجزائر",
        city: "براقي",
        quantity: 1,
        created_at: daysAgo(2), // 2 days ago
    },
    {
        wilaya: "الجزائر",
        city: "بئر مراد رايس",
        quantity: 2,
        created_at: daysAgo(3), // 3 days ago
    },
    {
        wilaya: "الجزائر",
        city: "الجزائر الوسطى",
        quantity: 1,
        created_at: daysAgo(5), // 5 days ago
    },
    {
        wilaya: "وهران",
        city: "السانيا",
        quantity: 2,
        created_at: daysAgo(4), // 4 days ago
    },
    {
        wilaya: "وهران",
        city: "بئر الجير",
        quantity: 1,
        created_at: daysAgo(6), // 6 days ago
    },
    {
        wilaya: "تيزي وزو",
        city: "تيزي وزو",
        quantity: 3,
        created_at: daysAgo(7), // 7 days ago
    },
    {
        wilaya: "عنابة",
        city: "عنابة",
        quantity: 1,
        created_at: daysAgo(8), // 8 days ago
    },
    {
        wilaya: "سطيف",
        city: "سطيف",
        quantity: 2,
        created_at: daysAgo(10), // 10 days ago
    },
    {
        wilaya: "بجاية",
        city: "بجاية",
        quantity: 1,
        created_at: daysAgo(12), // 12 days ago
    },
    {
        wilaya: "إيليزي",
        city: "إيليزي",
        quantity: 1,
        created_at: daysAgo(15), // 15 days ago
    },

    // More orders from same locations to test aggregation
    {
        wilaya: "الجزائر",
        city: "براقي",
        quantity: 2,
        created_at: daysAgo(20),
    },
    {
        wilaya: "الجزائر",
        city: "براقي",
        quantity: 1,
        created_at: daysAgo(25),
    },
];

async function seedOrders() {
    console.log("🌱 Starting to seed test orders...");

    const productId = "PROD-234567-A1B2C3"; // Default product number from your app

    for (let i = 0; i < testOrders.length; i++) {
        const order = testOrders[i];
        const orderId = id();
        const orderNumber = `ORD-TEST-${i + 1}-${Date.now()}`;

        try {
            await adminDb.transact([
                adminDb.tx.orders[orderId].update({
                    order_number: orderNumber,
                    customer_name: `Test Customer ${i + 1}`,
                    customer_email: `test${i + 1}@example.com`,
                    customer_phone: 213600000000 + i,
                    customer_address: `Test Address ${i + 1}`,
                    customer_wilaya: order.wilaya,
                    customer_city: order.city,
                    quantity: order.quantity,
                    status: { value: "pending", label: "قيد الانتظار" },
                    total_amount: (order.quantity * 2500).toString(),
                    created_at: order.created_at,
                    updated_at: order.created_at,
                }),
            ]);

            console.log(`✅ Created order ${i + 1}/${testOrders.length}: ${orderNumber} - ${order.quantity}x from ${order.city}, ${order.wilaya}`);
        } catch (error) {
            console.error(`❌ Failed to create order ${i + 1}:`, error);
        }
    }

    console.log("✨ Seeding complete!");
    console.log(`📊 Total orders created: ${testOrders.length}`);
    console.log("\nBreakdown:");
    console.log("- Recent orders (< 24h): 3");
    console.log("- Older orders (> 24h): 12");
    console.log("- Orders from الجزائر: 6");
    console.log("- Orders from براقي: 3");
}

// Run the seeding function
seedOrders().catch(console.error);
