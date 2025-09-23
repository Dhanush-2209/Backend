import fetch from "node-fetch";

// Wait 3 seconds to ensure json-server is ready
await new Promise(resolve => setTimeout(resolve, 3000));

const BASE_URL = "http://localhost:3001/users";

async function updateStatuses() {
  try {
    const res = await fetch(BASE_URL);
    const users = await res.json();
    const now = new Date();

    for (const user of users) {
      const updatedOrders = [];

      for (const order of user.orders || []) {
        if (order.status === "Cancelled") {
          console.log(`⏭️ Skipped cancelled order ${order.id} (User ${user.id})`);
          updatedOrders.push(order);
          continue;
        }

        const placed = new Date(order.orderedTime);
        const delivery = new Date(order.deliveryDate);
        const diffSeconds = (now - placed) / 1000;

        let newStatus = order.status;

        if (now.toDateString() === delivery.toDateString()) {
          newStatus = "Delivered";
        } else if (diffSeconds >= 3600) {
          newStatus = "Out for Delivery";
        } else if (diffSeconds >= 1800) {
          newStatus = "Shipped";
        } else {
          newStatus = "Ordered";
        }

        if (newStatus !== order.status) {
          console.log(`✅ Order ${order.id} (User ${user.id}) updated to ${newStatus}`);
        }

        updatedOrders.push({ ...order, status: newStatus });
      }

      // Patch updated orders back to user
      await fetch(`${BASE_URL}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: updatedOrders })
      });
    }
  } catch (err) {
    console.error("❌ Status update failed:", err.message);
  }
}

// Run every 5 minutes
setInterval(updateStatuses, 5 * 60 * 1000);
updateStatuses();
