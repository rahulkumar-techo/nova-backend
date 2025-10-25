import { log } from "@utils/logger";
import app from "app";
import configs from "configs";



const PORT = configs.port;

app.listen(PORT, () => {
  log.info(`Server started on port ${PORT} in ${configs.env} mode`);
});