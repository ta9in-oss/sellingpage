import googleAnalytics from './google'
import clarityAnalytics from './clarity'

export default () => {
  return [...googleAnalytics(), ...clarityAnalytics()]
}
