// src/index.ts
// Force the Koa proxy setting so Strapi will trust X-Forwarded-* headers.
// We avoid importing a Strapi type because some Strapi builds don't export it.
export default {
  register({ strapi }: { strapi: any }) {
    try {
      if (strapi && strapi.server && strapi.server.app) {
        // @ts-ignore - we are intentionally setting this runtime property
        strapi.server.app.proxy = true;
        strapi.log?.info?.("Bootstrap: set strapi.server.app.proxy = true");
      } else {
        strapi.log?.warn?.("Bootstrap: strapi.server.app not available yet");
      }
    } catch (err) {
      // Log but don't crash the startup
      if (strapi && strapi.log && typeof strapi.log.error === "function") {
        strapi.log.error("Bootstrap error forcing proxy:", err);
      } else {
        // fallback console log if strapi.log isn't available yet
        // eslint-disable-next-line no-console
        console.error("Bootstrap error forcing proxy:", err);
      }
    }
  },

  bootstrap() {
    // no-op
  },
};
