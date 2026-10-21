export const SITE_NAME = "Eritrean Full Gospel Church Cologne";
export const DEFAULT_DESCRIPTION =
  "Eritrean Full Gospel Church in Cologne: worship services, community programs, youth and children’s ministries, songs, and church news.";

export const getSiteUrl = () =>
  (process.env.REACT_APP_SITE_URL || "https://eriwongelkoeln.com").replace(/\/$/, "");

export const PUBLIC_ROUTES = [
  { path: "/", title: SITE_NAME, description: DEFAULT_DESCRIPTION },
  { path: "/program", title: "Services and Programs", description: "Explore worship services, Bible study, prayer meetings, and community programs at Eritrean Full Gospel Church Cologne." },
  { path: "/profile", title: "Our Church", description: "Learn about the community, faith, and ministry of Eritrean Full Gospel Church Cologne." },
  { path: "/mezmur", title: "Eritrean Gospel Songs", description: "Browse Eritrean gospel songs and worship lyrics from our Cologne church community." },
  { path: "/predict", title: "Preaching and Media", description: "Watch and discover preaching and Christian media from Eritrean Full Gospel Church Cologne." },
  { path: "/jugend", title: "Youth Ministry", description: "Discover faith, fellowship, and activities for young people in our Cologne youth ministry." },
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
