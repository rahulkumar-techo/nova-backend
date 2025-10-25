/**
 * Config loader for environment variables.
 * Loads simple settings used across the app.
 */

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

export default {
  port: PORT,
  env: NODE_ENV
};
