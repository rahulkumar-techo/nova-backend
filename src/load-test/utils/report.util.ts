// utils/report.util.ts
// Description: Utility to run and report Autocannon tests with summary output

import autocannon from "autocannon";
import chalk from "chalk";

export async function runTest(config: any) {
  console.log(chalk.cyanBright(`\n🚀 Running: ${config.title}`));

  const result = await autocannon(config);

  console.table({
    "Requests/sec": result.requests.average,
    "Latency (ms)": result.latency.average,
    "Throughput (MB/s)": (result.throughput.average / (1024 * 1024)).toFixed(2),
    Errors: result.errors,
    Timeouts: result.timeouts,
  });

  console.log(chalk.green("✅ Test complete.\n"));
}
