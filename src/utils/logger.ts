/**
 * Simple logger utility.
 * Replace with winston/pino for production needs.
 */

export const log = {
  info: (msg: string) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg: string) => console.error(`[ERR] ${new Date().toISOString()} - ${msg}`)
};
