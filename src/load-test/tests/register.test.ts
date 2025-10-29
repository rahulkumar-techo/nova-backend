/**
 * 🔥 Autocannon Load Test Config for Register Endpoint
 * Ensures each test user is unique and avoids MongoDB duplicate key errors.
 * Uses crypto.randomUUID() for globally unique email IDs.
 */

import { Options } from "autocannon";
import { randomUUID } from "crypto"; // ✅ imported properly

// Optional: fallback random string generator
function randomString(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const registerTestConfig: Options = {
  url: "http://localhost:5000/api/user/register",
  method: "POST",
  connections: 5, // number of concurrent users
  duration: 5, // test duration in seconds
  pipelining: 1, // keep 1 request in flight per connection
  headers: {
    "Content-Type": "application/json",
  },

  setupClient: (client) => {
    // ✅ use randomUUID() directly — no crypto prefix needed
    const uniqueId = randomUUID();

    const body = JSON.stringify({
      fullname: `testuser_${randomString(5)}`,
      email: `user_${uniqueId}@example.com`,
      password: "12345678",
      confirmPassword: "12345678",
    });

    client.setBody(body);
  },
};
