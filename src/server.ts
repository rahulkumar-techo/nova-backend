
import app from "./app";
import configs from "@/configs/index";
import { db_connection } from "./configs/db_connection";
import { log } from "@/utils/logger";



const PORT = configs.port;



(async () => {
  try {
    await db_connection();
    app.listen(PORT, () => {
      log.info(`Server started on port ${PORT} in ${configs.env} mode`);
    });
  } catch (error: any) {
    log.error(`Failed to start server:\n ${error.message}`);
  }
})();
