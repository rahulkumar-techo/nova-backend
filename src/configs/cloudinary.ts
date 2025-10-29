
import { v2 as cloudinary } from "cloudinary";
import config_env from "./config-env";

if(!config_env){
  throw new Error("not found config_env at cloudinary config")
}
cloudinary.config({
  cloud_name:config_env.cloudinary_cloud_name,
  api_key:config_env.cloudinary_api_key,
  api_secret:config_env.cloudinary_api_secret,
});

export default cloudinary;