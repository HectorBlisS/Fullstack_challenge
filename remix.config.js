const baseConfig =
  process.env.NODE_ENV === "production"
    ? {
        server: "./server.js",
        serverBuildPath: ".netlify/functions-internal/server.js",
      }
    : undefined;

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...baseConfig,
  ignoredRouteFiles: ["**/.*"],
};
