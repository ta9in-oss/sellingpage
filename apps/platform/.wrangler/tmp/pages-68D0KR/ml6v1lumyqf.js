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
    "/assets/addStoreAdmin-CM6NzcAh.js",
    "/assets/app-CScAp-pm.css",
    "/assets/builder-D8VYq08e.js",
    "/assets/check-B-cqT1Jz.js",
    "/assets/createLucideIcon-DoZl4Rk2.js",
    "/assets/demo-1DF307_F.js",
    "/assets/deploy-DKR301Ph.js",
    "/assets/index-B4F1h-oc.js",
    "/assets/index-BRR2uMqT.js",
    "/assets/instantdb-BsSieBXX.js",
    "/assets/main-C4eVWa80.js",
    "/assets/pricing-XWmu0TQP.js",
    "/assets/rocket-C1pOgidy.js",
    "/assets/shopping-bag-DwoCsTiY.js",
    "/assets/TestimonialSection-BsnFzfzj.js",
    "/assets/ThemeContext-CN1Rr4ft.js",
    "/assets/useLang-Bo6nJNJX.js",
    "/assets/utils-BLvBaXwM.js",
    "/assets/zap-BXUxysap.js",
    "/assets/logo/7aba_store_logo_i1.png",
    "/assets/logo/7aba_store_logo_i1.svg",
    "/assets/logo/7aba_store_logo_i2.png",
    "/assets/logo/7aba_store_logo_i2.svg"
  ]
};

// ../../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/mohessaid/workspaces/tanstack/sellingpage/apps/platform/.wrangler/tmp/pages-68D0KR/bundledWorker-0.7364121696081791.mjs";
import { isRoutingRuleMatch } from "/home/mohessaid/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/mohessaid/workspaces/tanstack/sellingpage/apps/platform/.wrangler/tmp/pages-68D0KR/bundledWorker-0.7364121696081791.mjs";
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
//# sourceMappingURL=ml6v1lumyqf.js.map
