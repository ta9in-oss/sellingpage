/**
 * Shared head helpers.
 *
 * Two jobs, both aimed at Search Console hygiene:
 *
 * `pageHead` gives a public page a unique title, description and self-referencing
 * canonical. Without it a route inherits only the root's head, which carries no
 * title at all — Google then invents one and reports the page as a duplicate of
 * every other titleless route.
 *
 * `privateHead` marks an app route noindex. robots.txt already disallows
 * /dashboard and /auth, and a disallowed URL cannot be crawled — so Google never
 * reads this tag on those paths. It is here for the case robots.txt is relaxed,
 * or the path is reached through a redirect that robots.txt does not cover: the
 * two mechanisms answer different questions ("may I fetch it" vs "may I list
 * it"), and only the meta tag actually removes a URL from the index.
 */
export const SITE_URL = 'https://7aba.app'

export function pageHead({
  title,
  description,
  path,
}: {
  title: string
  description: string
  /** Route path, leading slash, no trailing slash. '' for the homepage. */
  path: string
}) {
  const url = `${SITE_URL}${path}`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function privateHead(title: string) {
  return {
    meta: [
      { title },
      // noindex,nofollow — these pages are behind auth, hold no public content,
      // and must never appear in results.
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
  }
}
