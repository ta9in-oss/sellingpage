// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/apple-touch-icon.png",
    "/bagpack_001.png",
    "/bagpack_002.png",
    "/bagpack_003.png",
    "/bagpack_004.png",
    "/bagpack_005.png",
    "/demo-hero-screenshot.png",
    "/demo-store-preview.png",
    "/favicon-96x96.png",
    "/favicon.ico",
    "/favicon.svg",
    "/web-app-manifest-192x192.png",
    "/web-app-manifest-512x512.png",
    "/.vite/manifest.json",
    "/assets/addStoreAdmin-BU-Tusx0.js",
    "/assets/app-CkqlG_7b.css",
    "/assets/builder-B59DKKA8.js",
    "/assets/check-gFybf4TI.js",
    "/assets/createLucideIcon-CoQ9qBfJ.js",
    "/assets/demo-DoqGmniq.js",
    "/assets/deploy-CGxNwubu.js",
    "/assets/external-link-D7MCbaVd.js",
    "/assets/index-BqVF2Z8l.js",
    "/assets/index-C8etFHNR.js",
    "/assets/index-Dvj62ek6.js",
    "/assets/index-YcjAfn5d.js",
    "/assets/input-BXDi95D3.js",
    "/assets/instantdb-DUzNZzkJ.js",
    "/assets/main-DiAvKmXR.js",
    "/assets/palette-DBClTT-j.js",
    "/assets/pricing-BtJ21hYU.js",
    "/assets/rocket-DcsmXcDN.js",
    "/assets/shopping-bag-D4cLvday.js",
    "/assets/TestimonialSection-BUkOsnIs.js",
    "/assets/ThemeContext-DO_w56Ut.js",
    "/assets/useBuilderStore-DAKCfWc-.js",
    "/assets/useLang-S4O52UMY.js",
    "/assets/utils-D8b6BoVP.js",
    "/assets/x-DnvSonyn.js",
    "/assets/zap-CAxRc--N.js",
    "/assets/logo/7aba_store_logo_i1.png",
    "/assets/logo/7aba_store_logo_i1.svg",
    "/assets/logo/7aba_store_logo_i2.png",
    "/assets/logo/7aba_store_logo_i2.svg"
  ]
};

// ../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/mohessaid/workspaces/tanstack/sellingpage/apps/platform/.wrangler/tmp/pages-jUGqzz/bundledWorker-0.07814864489027684.mjs";
import { isRoutingRuleMatch } from "/home/mohessaid/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/mohessaid/workspaces/tanstack/sellingpage/apps/platform/.wrangler/tmp/pages-jUGqzz/bundledWorker-0.07814864489027684.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=9f1hxchokli.js.map
