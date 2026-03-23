import clarityAnalytics from "./analytics/clarity";
import googleAnalytics from "./analytics/google";
import metaPixel from "./analytics/metapixel";

export default () => {
  return [...googleAnalytics(), ...clarityAnalytics(), ...metaPixel()];
};
