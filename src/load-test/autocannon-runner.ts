
// autocannon-runner.ts
// Description: Runs selected performance test(s)

import { homeTestConfig } from "./tests/home.test";
import { registerTestConfig } from "./tests/register.test";
import { runTest } from "./utils/report.util";

async function main() {
  console.log("🏁 Starting Autocannon performance suite...\n");

  // await runTest(registerTestConfig);
  await runTest(homeTestConfig);
  //   await runTest(uploadProfileTest);

  console.log("\n✅ All tests completed.");
}

main();
