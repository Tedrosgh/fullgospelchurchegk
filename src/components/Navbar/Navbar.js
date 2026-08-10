import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import logo from "../../images/logo.jpg";
import { refreshSession, signOut } from "../../api/api";

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
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const logout = async () => {
    const accessToken = user?.token;
    dispatch({ type: "LOGOUT" });
    setUser(null);
    setOpen(false);
    history.push("/");
    if (accessToken) {
      try {
        await signOut(accessToken);
      } catch {
        // The local session is cleared even if the server session expired.
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

  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          mt: { xs: 1.5, md: 2.5 },
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
          color: "common.white",
          background: "linear-gradient(100deg, #102a43 0%, #0d47a1 60%, #00695c 100%)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, md: 82 }, px: { xs: 1.5, md: 2.5 } }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "inherit", textDecoration: "none", flexShrink: 0 }}
          >
            <Box component="img" src={logo} alt="Church logo" sx={{ width: { xs: 48, md: 58 }, height: { xs: 48, md: 58 }, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.7)" }} />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography fontWeight={800} lineHeight={1.15}>Eritrean Full Gospel</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Church Cologne</Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={0.25} sx={{ ml: "auto", display: { xs: "none", lg: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                component={Link}
                to={page.path}
                color="inherit"
                sx={{
                  px: 1.25,
                  borderRadius: 2,
                  fontWeight: isActive(page.path) ? 800 : 600,
                  bgcolor: isActive(page.path) ? "rgba(255,255,255,.18)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,.14)" },
                }}
              >
                {page.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ ml: { xs: "auto", lg: 1.5 }, display: { xs: "none", md: "flex", lg: "flex" }, alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <Tooltip title={userName}><Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}>{userName.charAt(0).toUpperCase()}</Avatar></Tooltip>
                <Button color="inherit" variant="outlined" startIcon={<LogoutOutlinedIcon />} onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button component={Link} to="/auth" color="inherit" variant="outlined" startIcon={<LoginOutlinedIcon />}>Sign in</Button>
            )}
          </Box>

          <IconButton color="inherit" onClick={() => setOpen(true)} aria-label="Open navigation menu" sx={{ ml: { xs: "auto", md: 1 }, display: { lg: "none" } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: 290, sm: 340 } } }}>
        <Box sx={{ p: 2.5, color: "common.white", background: "linear-gradient(135deg, #102a43, #0d47a1)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box component="img" src={logo} alt="Church logo" sx={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              <Box><Typography fontWeight={800}>Church Cologne</Typography><Typography variant="caption" sx={{ opacity: 0.8 }}>Navigation</Typography></Box>
            </Stack>
            <IconButton color="inherit" onClick={() => setOpen(false)} aria-label="Close navigation menu"><CloseIcon /></IconButton>
          </Stack>
        </Box>

        <List sx={{ py: 1 }}>
          {pages.map((page) => (
            <ListItemButton key={page.path} component={Link} to={page.path} selected={isActive(page.path)} onClick={() => setOpen(false)}>
              <ListItemIcon>{page.path === "/" ? <HomeOutlinedIcon /> : <ArrowForwardIcon />}</ListItemIcon>
              <ListItemText primary={page.label} primaryTypographyProps={{ fontWeight: isActive(page.path) ? 800 : 600 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2.5 }}>
          {user ? (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: "secondary.main" }}>{userName.charAt(0).toUpperCase()}</Avatar><Box sx={{ minWidth: 0 }}><Typography fontWeight={700} noWrap>{userName}</Typography><Typography variant="caption" color="text.secondary">Signed in</Typography></Box></Stack>
              <Button fullWidth variant="outlined" color="error" startIcon={<LogoutOutlinedIcon />} onClick={logout}>Logout</Button>
            </Stack>
          ) : (
            <Button fullWidth component={Link} to="/auth" variant="contained" startIcon={<LoginOutlinedIcon />} onClick={() => setOpen(false)}>Sign in</Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
