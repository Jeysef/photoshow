import webpackConfig from "./webpack.config.js";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    webpack: webpackConfig,
    experimental: {
        typedRoutes: true,
    },
};

export default config;
