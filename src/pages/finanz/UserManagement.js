import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Checkbox, Chip, CircularProgress, FormControlLabel,
  Grid, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { createAdminUser, fetchAdminUsers, updateAdminUserAccess } from "../../api/api";

const teams = [
  ["finance", "Finance"], ["content", "Content & News"], ["worship", "Worship & Music"],
  ["programs", "Programs"], ["youth", "Youth"], ["children", "Children"],
];
const emptyForm = { email: "", fullName: "", password: "", role: "member", team: "content", teamRole: "viewer", emailConfirmed: false };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [feedback, setFeedback] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminUsers();
      setUsers(data.users || []);
    } catch (error) {
      setFeedback({ severity: "error", message: error.response?.data?.message || "Users could not be loaded. Deploy the admin-users Edge Function first." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const createUser = async (event) => {
    event.preventDefault();
    setSavingId("new");
    setFeedback(null);
    try {
      await createAdminUser(form);
      setForm(emptyForm);
      setFeedback({ severity: "success", message: "User created and access rules assigned." });
      await loadUsers();
    } catch (error) {
      setFeedback({ severity: "error", message: error.response?.data?.message || "User could not be created." });
    } finally { setSavingId(""); }
  };

  const changeUser = (id, field, value) => setUsers((current) => current.map((user) => user.id === id ? { ...user, [field]: value } : user));

  const saveAccess = async (user) => {
    setSavingId(user.id);
    setFeedback(null);
    try {
      await updateAdminUserAccess(user);
      setFeedback({ severity: "success", message: `Permissions updated for ${user.email}.` });
    } catch (error) {
      setFeedback({ severity: "error", message: error.response?.data?.message || "Permissions could not be updated." });
    } finally { setSavingId(""); }
  };

  return <Stack spacing={3}>
    <Box><Typography variant="overline" color="primary" fontWeight={800}>Access control</Typography><Typography variant="h4" fontWeight={850}>Users</Typography><Typography color="text.secondary">Create church users and assign application permissions enforced by Row Level Security.</Typography></Box>
    {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}
    <Paper component="form" onSubmit={createUser} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" spacing={1.25} alignItems="center" mb={2.5}><PersonAddAltOutlinedIcon color="primary" /><Typography variant="h6" fontWeight={800}>Add user</Typography></Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField fullWidth required label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth required type="password" label="Temporary password" helperText="Minimum 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} inputProps={{ minLength: 8 }} /></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth select label="Portal role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><MenuItem value="member">Team member</MenuItem><MenuItem value="admin">Portal administrator</MenuItem></TextField></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth select label="Functional team" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}>{teams.map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField></Grid>
        <Grid item xs={12} sm={4}><TextField fullWidth select label="Team access" value={form.teamRole} onChange={(e) => setForm({ ...form, teamRole: e.target.value })}><MenuItem value="viewer">Viewer</MenuItem><MenuItem value="editor">Editor</MenuItem><MenuItem value="manager">Manager</MenuItem></TextField></Grid>
        <Grid item xs={12}><FormControlLabel control={<Checkbox checked={form.emailConfirmed} onChange={(e) => setForm({ ...form, emailConfirmed: e.target.checked })} />} label="Mark email as confirmed" /></Grid>
      </Grid>
      <Button type="submit" variant="contained" startIcon={<PersonAddAltOutlinedIcon />} disabled={savingId === "new"} sx={{ mt: 2 }}>{savingId === "new" ? "Creating…" : "Create user"}</Button>
    </Paper>
    <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Table aria-label="Portal users"><TableHead><TableRow><TableCell>User</TableCell><TableCell>Status</TableCell><TableCell>Portal role</TableCell>{teams.map(([value, label]) => <TableCell key={value}>{label}</TableCell>)}<TableCell align="right">Action</TableCell></TableRow></TableHead>
        <TableBody>
          {users.map((user) => <TableRow key={user.id} hover><TableCell sx={{ minWidth: 190 }}><Typography fontWeight={700}>{user.fullName || "Unnamed user"}</Typography><Typography variant="body2" color="text.secondary">{user.email}</Typography></TableCell><TableCell><Chip size="small" color={user.confirmed ? "success" : "warning"} label={user.confirmed ? "Confirmed" : "Pending"} /></TableCell><TableCell><TextField select size="small" value={user.role} onChange={(e) => changeUser(user.id, "role", e.target.value)} sx={{ minWidth: 130 }}><MenuItem value="member">Member</MenuItem><MenuItem value="admin">Administrator</MenuItem></TextField></TableCell>{teams.map(([team, label]) => <TableCell key={team}><TextField select size="small" value={user.teamRoles?.[team] || "none"} onChange={(e) => changeUser(user.id, "teamRoles", { ...(user.teamRoles || {}), [team]: e.target.value })} inputProps={{ "aria-label": `${label} access for ${user.email}` }} sx={{ minWidth: 105 }}><MenuItem value="none">None</MenuItem><MenuItem value="viewer">Viewer</MenuItem><MenuItem value="editor">Editor</MenuItem><MenuItem value="manager">Manager</MenuItem></TextField></TableCell>)}<TableCell align="right"><Button startIcon={<SaveOutlinedIcon />} onClick={() => saveAccess(user)} disabled={savingId === user.id}>{savingId === user.id ? "Saving…" : "Save"}</Button></TableCell></TableRow>)}
          {!loading && !users.length && <TableRow><TableCell colSpan={10} align="center">No users found.</TableCell></TableRow>}
          {loading && <TableRow><TableCell colSpan={10} align="center"><CircularProgress size={28} /></TableCell></TableRow>}
        </TableBody>
      </Table>
    </TableContainer>
    <Alert severity="info">Roles control application access. Database policies remain defined in version-controlled SQL and cannot be edited from the browser.</Alert>
  </Stack>;
};

export default UserManagement;
