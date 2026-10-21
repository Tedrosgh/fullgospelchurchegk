import { writeFile } from "node:fs/promises";

const siteUrl = (process.env.REACT_APP_SITE_URL || "https://fullgospelchurchegk.vercel.app").replace(/\/$/, "");
const routes = [
  ["/", "1.0"],
  ["/program", "0.9"],
  ["/profile", "0.8"],
  ["/mezmur", "0.8"],
  ["/predict", "0.7"],
  ["/jugend", "0.8"],
  ["/kinder", "0.8"],
  ["/help", "0.5"],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([path, priority]) => `  <url><loc>${siteUrl}${path}</loc><priority>${priority}</priority></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth

Sitemap: ${siteUrl}/sitemap.xml
`;

await Promise.all([
  writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap),
  writeFile(new URL("../public/robots.txt", import.meta.url), robots),
]);

console.log(`Generated SEO crawl files for ${siteUrl}`);
