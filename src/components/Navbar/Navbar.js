import React, { useEffect, useState } from "react";
import { AppBar, Avatar, Box, Button, Collapse, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import logo from "../../images/logo.jpg";
import { checkPortalAdmin, refreshSession, signOut } from "../../api/api";

const pages = [
  { label: "Home", path: "/" },
  { label: "Program", path: "/program" },
  { label: "Mezmur", path: "/mezmur" },
  { label: "Finanz", path: "/finanz" },
  { label: "Predigt", path: "/predict" },
  { label: "Jugend", path: "/jugend" },
  { label: "Kinder", path: "/kinder" },
  { label: "Help", path: "/help" },
];

const readProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("profile"));
  } catch {
    localStorage.removeItem("profile");
    return null;
  }
};

const Navbar = () => {
  const [user, setUser] = useState(readProfile());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPortalAdmin, setIsPortalAdmin] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const logout = async () => {
    const accessToken = user?.token;
    dispatch({ type: "LOGOUT" });
    setUser(null);
    history.push("/");
    if (accessToken) {
      try {
        await signOut(accessToken);
      } catch {
        // The browser session is already cleared if the server token expired.
      }
    }
  };

  useEffect(() => {
    let active = true;
    let refreshTimer;

    const synchronizeSession = async () => {
      const storedUser = readProfile();
      if (!storedUser?.token) {
        if (active) setUser(null);
        return;
      }

      try {
        const decodedToken = decode(storedUser.token);
        const refreshIn = decodedToken.exp * 1000 - Date.now() - 60_000;
        if (refreshIn <= 0) {
          if (!storedUser.refreshToken) throw new Error("Missing refresh token");
          const { data } = await refreshSession(storedUser.refreshToken);
          if (active) {
            dispatch({ type: "AUTH", data });
            setUser(data);
          }
          return;
        }

        if (active) {
          setUser(storedUser);
          refreshTimer = setTimeout(synchronizeSession, refreshIn);
        }
      } catch {
        dispatch({ type: "LOGOUT" });
        if (active) setUser(null);
      }
    };

    synchronizeSession();
    return () => {
      active = false;
      clearTimeout(refreshTimer);
    };
  }, [dispatch, location.pathname]);

  const userName = user?.result?.name || user?.result?.email || "Member";
  const navigationPages = isPortalAdmin ? [...pages, { label: "Admin", path: "/admin" }] : pages;

  useEffect(() => {
    if (!user?.token) {
      setIsPortalAdmin(false);
      return;
    }
    checkPortalAdmin().then(({ data }) => setIsPortalAdmin(data)).catch(() => setIsPortalAdmin(false));
  }, [user?.token]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        mt: { xs: 1, md: 2 },
        mb: 3,
        borderRadius: { xs: 2.5, md: 3.5 },
        overflow: "hidden",
        color: "common.white",
        border: "1px solid rgba(255,255,255,.2)",
        background: "linear-gradient(110deg, #311b92 0%, #1565c0 38%, #00897b 72%, #f57c00 125%)",
        boxShadow: "0 18px 45px rgba(28,45,110,.24)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 70, md: 84 }, px: { xs: 1.5, sm: 2.5 } }}>
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "inherit", textDecoration: "none", minWidth: 0 }}>
          <Box component="img" src={logo} alt="Church logo" sx={{ width: { xs: 48, md: 58 }, height: { xs: 48, md: 58 }, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.85)", boxShadow: "0 5px 18px rgba(0,0,0,.22)" }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900} lineHeight={1.1} noWrap sx={{ fontSize: { xs: ".95rem", sm: "1.15rem" } }}>Eritrean Full Gospel</Typography>
            <Typography variant="caption" noWrap sx={{ opacity: 0.82 }}>Church Cologne</Typography>
          </Box>
        </Box>

        <Box sx={{ ml: "auto", pl: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
          {user ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title={userName}><Avatar sx={{ width: { xs: 34, md: 38 }, height: { xs: 34, md: 38 }, bgcolor: "#ffb300", color: "#17213a", fontWeight: 900 }}>{userName.charAt(0).toUpperCase()}</Avatar></Tooltip>
              <Button color="inherit" variant="outlined" startIcon={<LogoutOutlinedIcon />} onClick={logout} sx={{ borderColor: "rgba(255,255,255,.55)", borderRadius: 99 }}>Logout</Button>
            </Stack>
          ) : (
            <Button component={Link} to="/auth" color="inherit" variant="contained" startIcon={<LoginOutlinedIcon />} sx={{ display: { xs: "none", md: "inline-flex" }, bgcolor: "rgba(255,255,255,.16)", backdropFilter: "blur(8px)", borderRadius: 99, "&:hover": { bgcolor: "rgba(255,255,255,.25)" } }}>Sign in</Button>
          )}
          <IconButton
            color="inherit"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            sx={{ display: { xs: "inline-flex", md: "none" }, bgcolor: "rgba(255,255,255,.14)", "&:hover": { bgcolor: "rgba(255,255,255,.24)" } }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      <Collapse in={mobileMenuOpen} timeout="auto" unmountOnExit sx={{ display: { md: "none" } }}>
        <Box
          id="mobile-navigation"
          component="nav"
          aria-label="Mobile navigation"
          sx={{ display: "grid", gap: 0.75, p: 1.25, bgcolor: "rgba(4,15,38,.3)", borderTop: "1px solid rgba(255,255,255,.15)" }}
        >
          {navigationPages.map((page) => (
            <Button
              key={page.path}
              component={Link}
              to={page.path}
              color="inherit"
              aria-current={isActive(page.path) ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              sx={{ justifyContent: "flex-start", px: 2, py: 1.1, borderRadius: 2, fontWeight: isActive(page.path) ? 900 : 650, color: isActive(page.path) ? "#17213a" : "rgba(255,255,255,.9)", bgcolor: isActive(page.path) ? "#ffca28" : "transparent", "&:hover": { bgcolor: isActive(page.path) ? "#ffd54f" : "rgba(255,255,255,.14)" } }}
            >
              {page.label}
            </Button>
          ))}
          {!user && (
            <Button component={Link} to="/auth" color="inherit" startIcon={<LoginOutlinedIcon />} onClick={() => setMobileMenuOpen(false)} sx={{ justifyContent: "flex-start", px: 2, py: 1.1, borderRadius: 2 }}>
              Sign in
            </Button>
          )}
          {user && (
            <Button color="inherit" startIcon={<LogoutOutlinedIcon />} onClick={logout} sx={{ justifyContent: "flex-start", px: 2, py: 1.1, borderRadius: 2 }}>
              Logout {userName}
            </Button>
          )}
        </Box>
      </Collapse>

      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          display: { xs: "none", md: "flex" },
          gap: { xs: 0.5, md: 0.75 },
          overflowX: "auto",
          px: { xs: 1.25, md: 2.25 },
          py: 1.15,
          bgcolor: "rgba(4,15,38,.3)",
          borderTop: "1px solid rgba(255,255,255,.15)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,.45) transparent",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,.45)", borderRadius: 4 },
        }}
      >
        {navigationPages.map((page) => (
          <Button
            key={page.path}
            component={Link}
            to={page.path}
            color="inherit"
            aria-current={isActive(page.path) ? "page" : undefined}
            sx={{
              flex: { md: 1 },
              flexShrink: 0,
              minWidth: "max-content",
              px: { xs: 2, md: 1.5 },
              py: 1,
              borderRadius: 99,
              fontWeight: isActive(page.path) ? 900 : 650,
              color: isActive(page.path) ? "#17213a" : "rgba(255,255,255,.9)",
              bgcolor: isActive(page.path) ? "#ffca28" : "transparent",
              boxShadow: isActive(page.path) ? "0 6px 18px rgba(0,0,0,.18)" : "none",
              "&:hover": { bgcolor: isActive(page.path) ? "#ffd54f" : "rgba(255,255,255,.14)" },
            }}
          >
            {page.label}
          </Button>
        ))}
      </Box>
    </AppBar>
  );
};

export default Navbar;
