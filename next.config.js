import { env } from "./src/env.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    // webpack: webpackConfig,
    experimental: {
        typedRoutes: true,
    },
    env: {
        FLUENTFFMPEG_COV: "",
        VERCEL_URL: env.VERCEL_URL,
    },
};

export default config;
