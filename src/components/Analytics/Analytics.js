import { useEffect, useState } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";

const CONSENT_KEY = "full-gospel-church-analytics-consent";
const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

const loadGoogleAnalytics = () => {
  if (!measurementId || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false, anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
};

const Analytics = () => {
  const { pathname, search } = useLocation();
  const [consent, setConsent] = useState(() => localStorage.getItem(CONSENT_KEY));

  useEffect(() => {
    if (consent === "granted") loadGoogleAnalytics();
  }, [consent]);

  useEffect(() => {
    if (consent === "granted" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: `${pathname}${search}`,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [consent, pathname, search]);

  if (!measurementId || consent) return null;

  const choose = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <Alert
      severity="info"
      role="dialog"
      aria-label="Analytics preferences"
      sx={{ position: "fixed", zIndex: 1500, left: 16, right: 16, bottom: 16, maxWidth: 720, mx: "auto", boxShadow: 8, alignItems: "center" }}
      action={
        <Stack direction="row" spacing={1}>
          <Button color="inherit" size="small" onClick={() => choose("denied")}>Decline</Button>
          <Button variant="contained" size="small" onClick={() => choose("granted")}>Allow analytics</Button>
        </Stack>
      }
    >
      We use optional Google Analytics to understand website visits and improve the site.
    </Alert>
  );
};

export default Analytics;
