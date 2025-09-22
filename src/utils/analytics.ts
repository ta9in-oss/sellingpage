import clarityAnalytics from "./analytics/clarity";
import googleAnalytics from "./analytics/google";

export default () => {
  return [...googleAnalytics(), ...clarityAnalytics()];
};
