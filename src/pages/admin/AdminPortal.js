import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { checkPortalAdmin } from "../../api/api";
import UserManagement from "../finanz/UserManagement";

const AdminPortal = () => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkPortalAdmin().then(({ data }) => setAllowed(data)).catch(() => setAllowed(false)).finally(() => setLoading(false));
  }, []);

  return <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
    <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, color: "common.white", background: "linear-gradient(120deg, #111827, #1e3a8a 60%, #0f766e)" }}>
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 48, mb: 1.5 }} />
      <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 2 }}>Restricted workspace</Typography>
      <Typography variant="h3" component="h1" fontWeight={900}>Admin Portal</Typography>
      <Typography sx={{ opacity: 0.8, mt: 1 }}>Manage church users, functional teams, roles, and application access.</Typography>
    </Paper>
    {loading ? <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box> : !allowed ? <Alert severity="error">This portal is restricted to church administrators.</Alert> :
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={2.5}><Paper sx={{ borderRadius: 3, overflow: "hidden", position: { md: "sticky" }, top: { md: 24 } }}><Box sx={{ p: 2.5, bgcolor: "grey.900", color: "common.white" }}><Typography fontWeight={800}>Administration</Typography><Typography variant="body2" sx={{ opacity: 0.7 }}>Portal navigation</Typography></Box><List sx={{ p: 1 }}><ListItemButton selected sx={{ borderRadius: 2 }}><ListItemIcon><PeopleAltOutlinedIcon /></ListItemIcon><ListItemText primary="Users" secondary="Teams and roles" primaryTypographyProps={{ fontWeight: 800 }} /></ListItemButton></List></Paper></Grid>
        <Grid item xs={12} md={9.5}><UserManagement /></Grid>
      </Grid>}
  </Container>;
};

export default AdminPortal;
