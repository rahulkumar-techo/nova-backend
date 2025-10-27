
import dotenv from "dotenv"
dotenv.config()

if (!process.env) {
    throw Error("Env file not config")
};
const config_env = {
    server_port: process.env.SERVER_PORT || "",
    node_env: process.env.NODE_ENV || "",
    redis_uri: process.env.REDIS_URI || "",
    google_client_id: process.env.GOOGLE_CLIENT_ID || "",
    google_secret_id: process.env.GOOGLE_SECRET_ID || "",
    callback_url: process.env.CALLBACK_URL || "",
    mongodb_uri: process.env.MONGODB_URI || "",
    github_clinet_id: process.env.GITHUB_CLIENT_ID || "",
    github_secret_id: process.env.GITHUB_SECRET_ID || "",
    github_callback_url: process.env.GITHUB_CALLBACK_URL || "",
    // JWT
    jwt_access_secret: process.env.JWT_ACCESS_SECRET || "",
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "",
    jwt_access_expiry: process.env.JWT_ACCESS_EXPIRY || "",
    jwt_refresh_expiry: process.env.JWT_REFRESH_EXPIRY || "",
    // Cookie
    cookie_domain: process.env.COOKIE_DOMAIN || "",
    cookie_secure: process.env.COOKIE_SECURE || "",
    cookie_same_site: process.env.COOKIE_SAME_SITE || "",
    cookie_http_only: process.env.COOKIE_HTTP_ONLY || "",
    cors_origin: process.env.CORS_ORIGIN || "",
    cors_credentials: process.env.CORS_CREDENTIALS || "",
    // Resend
    resend_api_key: process.env.RESEND_API_KEY || ""
};

export default config_env;