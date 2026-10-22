export const SITE_NAME = "Eritrean Full Gospel Church Cologne";
export const DEFAULT_DESCRIPTION =
  "Visit Eritrean Full Gospel Church in Cologne (Köln) for worship services, prayer, youth and children's ministries, Eritrean gospel songs, and church news.";

export const getSiteUrl = () =>
  (process.env.REACT_APP_SITE_URL || "https://eriwongelkoeln.com").replace(/\/$/, "");

export const PUBLIC_ROUTES = [
  { path: "/", title: SITE_NAME, description: DEFAULT_DESCRIPTION },
  { path: "/program", title: "Services and Programs", description: "Explore worship services, Bible study, prayer meetings, and community programs at Eritrean Full Gospel Church Cologne." },
  { path: "/profile", title: "Our Church", description: "Learn about the community, faith, and ministry of Eritrean Full Gospel Church Cologne." },
  { path: "/mezmur", title: "Mezmur — Eritrean Gospel Songs and Lyrics", description: "Browse Mezmur, Eritrean gospel songs and worship lyrics from Eritrean Full Gospel Church in Cologne (Köln)." },
  { path: "/predict", title: "Preaching and Media", description: "Watch and discover preaching and Christian media from Eritrean Full Gospel Church Cologne." },
  { path: "/jugend", title: "Youth Ministry — Jugend", description: "Discover faith, fellowship, and activities for young people at Eritrean Full Gospel Church in Cologne (Köln). Explore our Jugend youth ministry." },
  { path: "/kinder", title: "Children’s Ministry", description: "A welcoming Christian children’s ministry where young faith can grow through learning, worship, and community." },
  { path: "/help", title: "Help and Information", description: "Find practical information and answers about Eritrean Full Gospel Church Cologne." },
];

export const findRouteSeo = (pathname) => {
  const exactRoute = PUBLIC_ROUTES.find(({ path }) => path === pathname);
  if (exactRoute) return { ...exactRoute, noIndex: false };

  if (/^\/posts\/[^/]+$/.test(pathname)) {
    return { title: "Church Announcement", description: "Read the latest announcement from Eritrean Full Gospel Church Cologne.", noIndex: false };
  }
  if (/^\/mezmur\/[^/]+$/.test(pathname) && !pathname.endsWith("/print")) {
    return { title: "Eritrean Gospel Song", description: "Read gospel song lyrics from Eritrean Full Gospel Church Cologne.", noIndex: false };
  }

  return { title: "Private Page", description: DEFAULT_DESCRIPTION, noIndex: true };
};
