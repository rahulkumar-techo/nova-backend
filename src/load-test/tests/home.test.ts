import { Options } from "autocannon";

export const homeTestConfig: Options = {
  url: "http://localhost:5000/",  // Target endpoint
  method: "GET",                  // Request type
  connections: 5,                 // 5 concurrent users
  duration: 5,                    // Test runs for 5 seconds
  pipelining: 1,                  // 1 request per connection at a time
  headers: {
    "Content-Type": "application/json",
  },
};
