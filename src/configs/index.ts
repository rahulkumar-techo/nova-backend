/**
 * Config loader for environment variables.
 * Loads simple settings used across the app.
 */
import config_env from "./config-env";

const PORT = config_env.server_port ? Number(config_env.server_port) : 5000;
const NODE_ENV = config_env.node_env || "development";

export default {
  port: PORT,
  env: NODE_ENV
};
