import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  checkFinanceAdmin,
  createFinanceEntry,
  deleteFinanceEntry,
  fetchFinanceEntries,
  updateFinanceEntry,
} from "../../api/api";

const BANK_DETAILS = {
  holder: "Eritreische Gemeinde für das ganze Evangelium e.V.",
  bank: "Volksbank Köln Bonn eG",
  iban: "DE59 3806 0186 6402 4010 18",
  bic: "GENODED1BRS",
};

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const currentWeekStart = () => {
  const date = new Date();
  const daysSinceMonday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - daysSinceMonday);
  return localDate(date);
};

const blankEntry = (weekStart = currentWeekStart()) => ({
  weekStart,
  type: "income",
  category: "",
  description: "",
  amount: "",
});

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const displayDate = (value) =>
  value
    ? new Intl.DateTimeFormat("de-DE", { timeZone: "UTC" }).format(
        new Date(`${value}T00:00:00Z`)
      )
    : "—";

const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("profile"));
  } catch {
    return null;
  }
};

const Finanz = () => {
  const history = useHistory();
  const profile = getProfile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(Boolean(profile?.token));
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart());
  const [form, setForm] = useState(blankEntry());
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchFinanceEntries();
      setEntries(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Finance data could not be loaded. Run the latest Supabase schema if this is the first setup."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profile?.token) return;

    let active = true;
    checkFinanceAdmin()
      .then(({ data }) => {
        if (!active) return;
        setIsAdmin(data);
        if (data) loadEntries();
      })
      .catch(() => active && setError("Your finance access could not be verified."))
      .finally(() => active && setCheckingAccess(false));

    return () => {
      active = false;
    };
  }, [loadEntries, profile?.token]);

  const weeklyEntries = useMemo(
    () => entries.filter((entry) => entry.weekStart === selectedWeek),
    [entries, selectedWeek]
  );

  const totals = useMemo(
    () =>
      weeklyEntries.reduce(
        (result, entry) => ({
          ...result,
          [entry.type]: result[entry.type] + entry.amount,
        }),
        { income: 0, expense: 0 }
      ),
    [weeklyEntries]
  );

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copied.`);
    } catch {
      setError(`${label} could not be copied. Please select it manually.`);
    }
  };

  const changeForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(blankEntry(selectedWeek));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.category.trim() || !form.amount || Number(form.amount) <= 0) {
      setError("Enter a category and an amount greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await updateFinanceEntry(editingId, form);
        setNotice("Finance entry updated.");
      } else {
        await createFinanceEntry(form);
        setNotice("Finance entry added.");
      }
      setSelectedWeek(form.weekStart);
      resetForm();
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The finance entry could not be saved.");
      setLoading(false);
    }
  };

  const edit = (entry) => {
    setEditingId(entry.id);
    setForm({
      weekStart: entry.weekStart,
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: String(entry.amount),
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const remove = async (entry) => {
    if (!window.confirm(`Delete the ${entry.category} entry?`)) return;
    setLoading(true);
    setError("");
    try {
      await deleteFinanceEntry(entry.id);
      setNotice("Finance entry deleted.");
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The entry could not be deleted.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
            Church Finance
          </Typography>
          <Typography color="text.secondary">
            Donation bank details and secure weekly accounting for authorized church administrators.
          </Typography>
        </Box>

        <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccountBalanceIcon />
              <Typography variant="h5" fontWeight={700}>Donation bank account</Typography>
            </Stack>
          </Box>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="text.secondary">Account holder</Typography>
                <Typography variant="h6">{BANK_DETAILS.holder}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="text.secondary">Bank</Typography>
                <Typography variant="h6">{BANK_DETAILS.bank}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="text.secondary">IBAN</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>{BANK_DETAILS.iban}</Typography>
                  <Tooltip title="Copy IBAN">
                    <IconButton onClick={() => copy("IBAN", BANK_DETAILS.iban.replace(/\s/g, ""))} aria-label="Copy IBAN">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="text.secondary">BIC</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6">{BANK_DETAILS.bic}</Typography>
                  <Tooltip title="Copy BIC">
                    <IconButton onClick={() => copy("BIC", BANK_DETAILS.bic)} aria-label="Copy BIC">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
            <Alert severity="info" icon={<LockOutlinedIcon />} sx={{ mt: 3 }}>
              For security, online-banking login is never available through this website. Use your bank’s official app or website.
            </Alert>
          </CardContent>
        </Card>

        <Divider />

        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Weekly income and expenses</Typography>
          {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
          {!profile?.token ? (
            <Alert
              severity="info"
              action={<Button color="inherit" onClick={() => history.push("/auth")}>Sign in</Button>}
            >
              Sign in with an authorized administrator account to access church finance records.
            </Alert>
          ) : checkingAccess ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}><CircularProgress /></Box>
          ) : !isAdmin ? (
            <Alert severity="warning">Finance records are restricted to designated church administrators.</Alert>
          ) : (
            <Stack spacing={3}>
              <TextField
                label="Week starting"
                type="date"
                value={selectedWeek}
                onChange={(event) => setSelectedWeek(event.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: 240 }}
              />

              <Grid container spacing={2}>
                {[
                  ["Income", totals.income, "success.main"],
                  ["Expenses", totals.expense, "error.main"],
                  ["Balance", totals.income - totals.expense, "primary.main"],
                ].map(([label, value, color]) => (
                  <Grid item xs={12} sm={4} key={label}>
                    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                      <Typography color="text.secondary">{label}</Typography>
                      <Typography variant="h5" fontWeight={800} color={color}>{money.format(value)}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table aria-label="Weekly finance entries">
                  <TableHead>
                    <TableRow>
                      <TableCell>Week</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weeklyEntries.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>{displayDate(entry.weekStart)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={entry.type === "income" ? "Income" : "Expense"}
                            color={entry.type === "income" ? "success" : "error"}
                          />
                        </TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.description || "—"}</TableCell>
                        <TableCell align="right">{money.format(entry.amount)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit"><IconButton onClick={() => edit(entry)} aria-label="Edit entry"><EditOutlinedIcon /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton color="error" onClick={() => remove(entry)} aria-label="Delete entry"><DeleteOutlineIcon /></IconButton></Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && !weeklyEntries.length && (
                      <TableRow><TableCell colSpan={6} align="center">No entries recorded for this week.</TableCell></TableRow>
                    )}
                    {loading && (
                      <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={28} /></TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {editingId ? "Modify entry" : "Add weekly entry"}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth required name="weekStart" label="Week starting" type="date" value={form.weekStart} onChange={changeForm} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth select required name="type" label="Type" value={form.type} onChange={changeForm}>
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth required name="category" label="Category" value={form.category} onChange={changeForm} inputProps={{ maxLength: 100 }} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth required name="amount" label="Amount (EUR)" type="number" value={form.amount} onChange={changeForm} inputProps={{ min: "0.01", step: "0.01" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth name="description" label="Description (optional)" value={form.description} onChange={changeForm} multiline minRows={2} />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={loading}>
                    {editingId ? "Save changes" : "Add entry"}
                  </Button>
                  {editingId && <Button onClick={resetForm}>Cancel</Button>}
                </Stack>
              </Paper>
            </Stack>
          )}
        </Box>
      </Stack>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")} message={notice} />
    </Container>
  );
};

export default Finanz;
