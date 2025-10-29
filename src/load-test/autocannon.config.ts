
// autocannon.config.ts
// Description: Base configuration factory for Autocannon tests

import type { Options } from "autocannon";

export const createTestConfig = (overrides: Partial<Options>): Options => ({
  url: "http://localhost:5000/api", // 👈 change base URL
  connections: 50, // concurrent users
  duration: 10, // seconds
  pipelining: 1,
  timeout: 30,
  ...overrides,
});
