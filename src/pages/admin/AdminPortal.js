import { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { fetchMyPortalAccess } from "../../api/api";
import Finanz from "../finanz/Finanz";
import UserManagement from "../finanz/UserManagement";
import Mezmur from "../mezmur/Mezmur";
import AddNewMezmur from "../mezmur/Add_new_mezmur";

const financeSections = [
  ["overview", "Overview", <DashboardOutlinedIcon />],
  ["income", "Weekly income", <TrendingUpIcon />],
  ["expense", "Weekly expenses", <TrendingDownIcon />],
  ["balance", "Balance", <AccountBalanceWalletOutlinedIcon />],
  ["report", "Reports", <AssessmentOutlinedIcon />],
  ["documents", "Documents", <FolderOutlinedIcon />],
];

const AdminPortal = () => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState({ isAdmin: false, teams: {} });
  const [section, setSection] = useState(location.pathname.includes("/admin/mezmur/") ? "mezmur-form" : "overview");

  const selectSection = (nextSection) => {
    if (nextSection === "mezmur-form") {
      history.push("/admin/mezmur/add");
      setSection(nextSection);
      return;
    }
    if (location.pathname !== "/admin") history.push("/admin");
    setSection(nextSection);
  };

  useEffect(() => {
    fetchMyPortalAccess().then(({ data }) => {
      setAccess(data);
      if (location.pathname === "/admin" && !data.isAdmin && !data.teams?.finance && data.teams?.worship) setSection("mezmur-list");
    }).catch(() => setAccess({ isAdmin: false, teams: {} })).finally(() => setLoading(false));
  }, [location.pathname]);

  const canUseFinance = access.isAdmin || Boolean(access.teams?.finance);
  const canManageMezmur = access.isAdmin || ["editor", "manager"].includes(access.teams?.worship);
  const allowed = access.isAdmin || canUseFinance || canManageMezmur;

  return <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
    <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, color: "common.white", background: "linear-gradient(120deg, #111827, #1e3a8a 60%, #0f766e)" }}>
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 48, mb: 1.5 }} />
      <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 2 }}>Restricted workspace</Typography>
      <Typography variant="h3" component="h1" fontWeight={900}>Admin Portal</Typography>
      <Typography sx={{ opacity: 0.8, mt: 1 }}>Manage church finances, users, functional teams, roles, and application access.</Typography>
    </Paper>

    {loading ? <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box> : !allowed ?
      <Alert severity="info" action={<Button component={Link} to="/auth" color="inherit" startIcon={<LoginOutlinedIcon />}>Admin login</Button>}>Sign in with an authorized administrator account to open this portal.</Alert> :
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper sx={{ borderRadius: 3, overflow: "hidden", position: { md: "sticky" }, top: { md: 24 }, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ p: 2.5, bgcolor: "grey.900", color: "common.white" }}><Typography fontWeight={800}>Administration</Typography><Typography variant="body2" sx={{ opacity: 0.7 }}>Portal navigation</Typography></Box>
            <List sx={{ p: 1 }}>
              {canUseFinance && <><Typography variant="overline" color="text.secondary" sx={{ display: "block", px: 2, pt: 1, fontWeight: 800 }}>Finanz</Typography>{financeSections.map(([key, label, icon]) => <ListItemButton key={key} selected={section === key} onClick={() => selectSection(key)} sx={{ borderRadius: 2, pl: 2 }}><ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>{icon}</ListItemIcon><ListItemText primary={label} primaryTypographyProps={{ fontWeight: section === key ? 800 : 600 }} /></ListItemButton>)}<Divider sx={{ my: 1 }} /></>}
              {canManageMezmur && <><Typography variant="overline" color="text.secondary" sx={{ display: "block", px: 2, pt: 1, fontWeight: 800 }}>Mezmur</Typography><ListItemButton selected={section === "mezmur-list"} onClick={() => selectSection("mezmur-list")} sx={{ borderRadius: 2 }}><ListItemIcon sx={{ color: "inherit" }}><MusicNoteOutlinedIcon /></ListItemIcon><ListItemText primary="Manage Mezmur" /></ListItemButton><ListItemButton selected={section === "mezmur-form"} onClick={() => selectSection("mezmur-form")} sx={{ borderRadius: 2 }}><ListItemIcon sx={{ color: "inherit" }}><AddCircleOutlineIcon /></ListItemIcon><ListItemText primary="Add Mezmur" /></ListItemButton><Divider sx={{ my: 1 }} /></>}
              {access.isAdmin && <ListItemButton selected={section === "users"} onClick={() => selectSection("users")} sx={{ borderRadius: 2 }}><ListItemIcon sx={{ color: "inherit" }}><PeopleAltOutlinedIcon /></ListItemIcon><ListItemText primary="Users & RLS" secondary="Teams and roles" primaryTypographyProps={{ fontWeight: 800 }} /></ListItemButton>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9} lg={9.5}>
          {section === "users" ? (access.isAdmin ? <UserManagement /> : <Alert severity="error">Administrator access is required.</Alert>) : section === "mezmur-list" ? (canManageMezmur ? <Mezmur adminMode embedded /> : <Alert severity="error">Worship & Music editor access is required.</Alert>) : section === "mezmur-form" ? (canManageMezmur ? <AddNewMezmur embedded /> : <Alert severity="error">Worship & Music editor access is required.</Alert>) : canUseFinance ? <Finanz embedded initialSection={section} /> : <Alert severity="error">Finance team access is required.</Alert>}
        </Grid>
      </Grid>}
  </Container>;
};

export default AdminPortal;
