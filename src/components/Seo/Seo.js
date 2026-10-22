import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_DESCRIPTION, findRouteSeo, getSiteUrl, SITE_NAME } from "../../config/site";

const ContentSeoContext = createContext(null);

export const SeoProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  return <ContentSeoContext.Provider value={{ content, setContent }}>{children}</ContentSeoContext.Provider>;
};

// Keep fetched content tied to its route so it cannot leak into another page.
export const useContentSeo = (title, text) => {
  const { pathname } = useLocation();
  const { setContent } = useContext(ContentSeoContext);
  useEffect(() => {
    if (!title) return undefined;
    const description = String(text || "").replace(/\s+/g, " ").trim();
    setContent({ pathname, title, description: description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description || DEFAULT_DESCRIPTION });
    return () => setContent(null);
  }, [pathname, title, text, setContent]);
};

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

const Seo = () => {
  const { pathname } = useLocation();
  const { content } = useContext(ContentSeoContext);

  useEffect(() => {
    const route = findRouteSeo(pathname);
    const { title, description = DEFAULT_DESCRIPTION, noIndex } = {
      ...route,
      ...(content?.pathname === pathname ? content : {}),
    };
    const siteUrl = getSiteUrl();
    const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', { name: "robots", content: noIndex ? "noindex, nofollow" : "index, follow" });
    setMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [pathname, content]);

  return null;
};

export default Seo;
