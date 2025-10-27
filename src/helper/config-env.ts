
import dotenv from "dotenv"
dotenv.config()

if(!process.env){
    throw Error("Env file not config")
};
const config_env = {
    google_client_id:process.env.GOOGLE_CLIENT_ID||"",
    google_secret_id:process.env.GOOGLE_SECRET_ID||"",
    callback_url:process.env.CALLBACK_URL||"",
    mongodb_uri:process.env.MONGODB_URI||"",
    github_clinet_id:process.env.GITHUB_CLIENT_ID||"",
    github_secret_id:process.env.GITHUB_SECRET_ID||""
};

export default config_env;