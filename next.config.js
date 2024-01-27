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
        esmExternals: "loose",
    },
    env: {
        FLUENTFFMPEG_COV: "",
    },
};

export default config;
