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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import UserManagement from "./UserManagement";
import {
  checkFinanceAdmin,
  checkPortalAdmin,
  createFinanceDocument,
  createFinanceEntry,
  deleteFinanceDocument,
  deleteFinanceEntry,
  fetchFinanceDocuments,
  fetchFinanceEntries,
  updateFinanceDocument,
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

const blankDocument = () => ({
  type: "receipt",
  title: "",
  documentDate: localDate(new Date()),
  fileUrl: "",
  notes: "",
});

const documentLabels = {
  receipt: "Receipt",
  invoice: "Invoice",
  bank_statement: "Bank statement",
  other: "Other",
};

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
  const [isPortalAdmin, setIsPortalAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(Boolean(profile?.token));
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart());
  const [form, setForm] = useState(blankEntry());
  const [editingId, setEditingId] = useState(null);
  const [documentForm, setDocumentForm] = useState(blankDocument());
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [entryResponse, documentResponse] = await Promise.all([
        fetchFinanceEntries(),
        fetchFinanceDocuments(),
      ]);
      setEntries(entryResponse.data);
      setDocuments(documentResponse.data);
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
    Promise.all([checkFinanceAdmin(), checkPortalAdmin()])
      .then(([financeResponse, portalResponse]) => {
        if (!active) return;
        setIsAdmin(financeResponse.data);
        setIsPortalAdmin(portalResponse.data);
        if (financeResponse.data) loadEntries();
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

  const visibleEntries = useMemo(
    () => weeklyEntries.filter((entry) => entry.type === activeSection),
    [activeSection, weeklyEntries]
  );

  const weeklyReport = useMemo(() => {
    const rows = entries.reduce((result, entry) => {
      const row = result.get(entry.weekStart) || { weekStart: entry.weekStart, income: 0, expense: 0 };
      row[entry.type] += entry.amount;
      result.set(entry.weekStart, row);
      return result;
    }, new Map());
    return Array.from(rows.values()).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [entries]);

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

  const allTimeTotals = useMemo(
    () =>
      entries.reduce(
        (result, entry) => ({
          ...result,
          [entry.type]: result[entry.type] + entry.amount,
        }),
        { income: 0, expense: 0 }
      ),
    [entries]
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

  const selectSection = (section) => {
    setActiveSection(section);
    if (section === "income" || section === "expense") {
      setEditingId(null);
      setForm({ ...blankEntry(selectedWeek), type: section });
    }
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

  const changeDocumentForm = (event) => {
    const { name, value } = event.target;
    setDocumentForm((current) => ({ ...current, [name]: value }));
  };

  const resetDocumentForm = () => {
    setEditingDocumentId(null);
    setDocumentForm(blankDocument());
  };

  const submitDocument = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingDocumentId) {
        await updateFinanceDocument(editingDocumentId, documentForm);
        setNotice("Document updated.");
      } else {
        await createFinanceDocument(documentForm);
        setNotice("Document added.");
      }
      resetDocumentForm();
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The document could not be saved.");
      setLoading(false);
    }
  };

  const editDocument = (document) => {
    setEditingDocumentId(document.id);
    setDocumentForm({
      type: document.type,
      title: document.title,
      documentDate: document.documentDate,
      fileUrl: document.fileUrl,
      notes: document.notes,
    });
  };

  const removeDocument = async (document) => {
    if (!window.confirm(`Delete ${document.title}?`)) return;
    setLoading(true);
    try {
      await deleteFinanceDocument(document.id);
      setNotice("Document deleted.");
      await loadEntries();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The document could not be deleted.");
      setLoading(false);
    }
  };

  const financeNavigation = (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", position: { md: "sticky" }, top: { md: 24 }, border: "1px solid", borderColor: "divider", boxShadow: "0 16px 40px rgba(30,41,59,.10)" }}>
      <Box sx={{ p: 2.5, color: "common.white", background: "linear-gradient(135deg, #172554, #1d4ed8)" }}>
        <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1.5 }}>Church accounts</Typography>
        <Typography variant="h6" fontWeight={800}>Finance workspace</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>Record, review and reconcile</Typography>
      </Box>
      <List sx={{ p: 1.25, display: { xs: "flex", md: "block" }, gap: 0.75, overflowX: { xs: "auto", md: "visible" } }}>
        {[
          ["overview", "Overview", "Financial dashboard", <DashboardOutlinedIcon />],
          ["income", "Weekly income", "Record offerings and giving", <TrendingUpIcon />],
          ["expense", "Weekly expenses", "Record church spending", <TrendingDownIcon />],
          ["balance", "Balance", "Review available funds", <AccountBalanceWalletOutlinedIcon />],
          ["report", "Reports", "Compare weekly totals", <AssessmentOutlinedIcon />],
          ["documents", "Documents", "Receipts and statements", <FolderOutlinedIcon />],
          ...(isPortalAdmin ? [["users", "Users", "Roles and RLS access", <PeopleAltOutlinedIcon />]] : []),
        ].map(([key, label, description, icon]) => (
          <ListItemButton
            key={key}
            selected={activeSection === key}
            onClick={() => selectSection(key)}
            sx={{ minWidth: { xs: 175, md: 0 }, borderRadius: 2, mb: { md: 0.5 }, alignItems: "flex-start", "&.Mui-selected": { bgcolor: "primary.50", color: "primary.dark", "&:hover": { bgcolor: "primary.100" } } }}
          >
            <ListItemIcon sx={{ minWidth: 38, mt: 0.25, color: "inherit" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} secondary={description} primaryTypographyProps={{ fontWeight: 750 }} secondaryTypographyProps={{ sx: { display: { xs: "none", md: "block" }, lineHeight: 1.35 } }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={4}>
        <Paper sx={{ p: { xs: 3.5, sm: 5, md: 6 }, borderRadius: 4, color: "common.white", background: "linear-gradient(120deg, #311b92 0%, #1565c0 55%, #00897b 100%)", boxShadow: "0 24px 65px rgba(49,27,146,.22)" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "#ffca28", color: "#24164f", mb: 2 }}><AccountBalanceIcon fontSize="large" /></Box>
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,.72)", letterSpacing: 2, fontWeight: 800 }}>Stewardship and giving</Typography>
          <Typography variant="h3" component="h1" fontWeight={900} gutterBottom>Church Finance</Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,.84)", maxWidth: 720 }}>Donation bank details and secure weekly accounting for authorized church administrators.</Typography>
        </Paper>

        <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ background: "linear-gradient(90deg, #311b92, #1565c0, #00897b)", color: "common.white", p: 2.5 }}>
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
          {!isAdmin || checkingAccess ? (
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} md={3}>{financeNavigation}</Grid>
              <Grid item xs={12} md={9}>
                {!profile?.token ? (
                  <Alert severity="info" action={<Button color="inherit" onClick={() => history.push("/auth")}>Sign in</Button>}>
                    The finance workspace is visible, but church records and entry forms require an authorized administrator account.
                  </Alert>
                ) : checkingAccess ? (
                  <Paper sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, py: 5, borderRadius: 3 }}><CircularProgress size={28} /><Typography>Checking finance access…</Typography></Paper>
                ) : (
                  <Alert severity="warning">The finance navigation is available for reference. Financial records remain restricted to designated church administrators.</Alert>
                )}
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} md={3}>{financeNavigation}</Grid>
              <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              {activeSection === "overview" && <>
                <Box>
                  <Typography variant="overline" color="primary" fontWeight={800}>Administrator dashboard</Typography>
                  <Typography variant="h4" fontWeight={850}>Financial overview</Typography>
                  <Typography color="text.secondary">A current view of the church's recorded income, spending, and available balance.</Typography>
                </Box>
                <Grid container spacing={2}>
                  {[
                    ["Total income", allTimeTotals.income, "success.main", <TrendingUpIcon />],
                    ["Total expenses", allTimeTotals.expense, "error.main", <TrendingDownIcon />],
                    ["Current balance", allTimeTotals.income - allTimeTotals.expense, "primary.main", <AccountBalanceWalletOutlinedIcon />],
                  ].map(([label, value, color, icon]) => (
                    <Grid item xs={12} sm={4} key={label}>
                      <Paper sx={{ p: 3, height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                        <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: `${color.split(".")[0]}.50`, color, mb: 2 }}>{icon}</Box>
                        <Typography color="text.secondary" fontWeight={650}>{label}</Typography>
                        <Typography variant="h4" fontWeight={900} color={color} sx={{ mt: 0.5 }}>{money.format(value)}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                    <Box><Typography variant="h6" fontWeight={800}>This week's position</Typography><Typography color="text.secondary">Week beginning {displayDate(selectedWeek)}</Typography></Box>
                    <TextField label="Week starting" type="date" size="small" value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)} InputLabelProps={{ shrink: true }} />
                  </Stack>
                  <Divider sx={{ my: 2.5 }} />
                  <Grid container spacing={2}>
                    {[["Income", totals.income, "success.main"], ["Expenses", totals.expense, "error.main"], ["Balance", totals.income - totals.expense, "primary.main"]].map(([label, value, color]) => <Grid item xs={12} sm={4} key={label}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h6" fontWeight={850} color={color}>{money.format(value)}</Typography></Grid>)}
                  </Grid>
                </Paper>
              </>}

              {(activeSection === "income" || activeSection === "expense") && <>
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
                    {visibleEntries.map((entry) => (
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
                    {!loading && !visibleEntries.length && (
                      <TableRow><TableCell colSpan={6} align="center">No {activeSection} recorded for this week.</TableCell></TableRow>
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
                    <TextField fullWidth select disabled required name="type" label="Type" value={form.type} onChange={changeForm}>
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
              </>}

              {activeSection === "balance" && <>
                <Box><Typography variant="h5" fontWeight={800}>Balance and reconciliation</Typography><Typography color="text.secondary">Review income minus expenses before closing the selected week.</Typography></Box>
                <TextField label="Week starting" type="date" value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ maxWidth: 240 }} />
                <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, color: "common.white", background: totals.income - totals.expense < 0 ? "linear-gradient(135deg, #991b1b, #dc2626)" : "linear-gradient(135deg, #1e3a8a, #2563eb)" }}>
                  <Typography sx={{ opacity: 0.75 }}>Closing balance for this week</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ my: 1 }}>{money.format(totals.income - totals.expense)}</Typography>
                  <Typography sx={{ opacity: 0.85 }}>{money.format(totals.income)} income − {money.format(totals.expense)} expenses</Typography>
                </Paper>
                <Alert severity={totals.income - totals.expense < 0 ? "warning" : "info"}>Confirm that all offerings, donations, invoices, reimbursements, and receipts for this week have been entered before reconciliation.</Alert>
              </>}

              {activeSection === "report" && <>
                <Typography variant="h5" fontWeight={750}>Weekly report</Typography>
                <TextField label="Week starting" type="date" value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ maxWidth: 240 }} />
                <Grid container spacing={2}>
                  {[["Income", totals.income, "success.main"], ["Expenses", totals.expense, "error.main"], ["Balance", totals.income - totals.expense, "primary.main"]].map(([label, value, color]) => <Grid item xs={12} sm={4} key={label}><Paper sx={{ p: 2.5, borderRadius: 2 }}><Typography color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={800} color={color}>{money.format(value)}</Typography></Paper></Grid>)}
                </Grid>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table aria-label="Weekly finance report">
                    <TableHead><TableRow><TableCell>Week</TableCell><TableCell align="right">Income</TableCell><TableCell align="right">Expenses</TableCell><TableCell align="right">Balance</TableCell></TableRow></TableHead>
                    <TableBody>
                      {weeklyReport.map((row) => <TableRow key={row.weekStart} hover><TableCell>{displayDate(row.weekStart)}</TableCell><TableCell align="right">{money.format(row.income)}</TableCell><TableCell align="right">{money.format(row.expense)}</TableCell><TableCell align="right" sx={{ color: row.income - row.expense < 0 ? "error.main" : "success.main", fontWeight: 700 }}>{money.format(row.income - row.expense)}</TableCell></TableRow>)}
                      {!weeklyReport.length && <TableRow><TableCell colSpan={4} align="center">No finance data is available.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>}

              {activeSection === "documents" && <>
                <Box><Typography variant="h5" fontWeight={750}>Documents</Typography><Typography color="text.secondary">Receipts, invoices, bank statements, and related document links.</Typography></Box>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table aria-label="Finance documents">
                    <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Type</TableCell><TableCell>Title</TableCell><TableCell>Document</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                    <TableBody>
                      {documents.map((document) => <TableRow key={document.id} hover><TableCell>{displayDate(document.documentDate)}</TableCell><TableCell><Chip size="small" label={documentLabels[document.type]} /></TableCell><TableCell><Typography fontWeight={600}>{document.title}</Typography><Typography variant="body2" color="text.secondary">{document.notes}</Typography></TableCell><TableCell>{document.fileUrl ? <Button href={document.fileUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon />}>Open</Button> : "—"}</TableCell><TableCell align="right"><Tooltip title="Edit"><IconButton onClick={() => editDocument(document)} aria-label="Edit document"><EditOutlinedIcon /></IconButton></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => removeDocument(document)} aria-label="Delete document"><DeleteOutlineIcon /></IconButton></Tooltip></TableCell></TableRow>)}
                      {!loading && !documents.length && <TableRow><TableCell colSpan={5} align="center">No receipts or invoices have been registered.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Paper component="form" onSubmit={submitDocument} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{editingDocumentId ? "Modify document" : "Add document"}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth select required name="type" label="Document type" value={documentForm.type} onChange={changeDocumentForm}>{Object.entries(documentLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth required name="documentDate" label="Document date" type="date" value={documentForm.documentDate} onChange={changeDocumentForm} InputLabelProps={{ shrink: true }} /></Grid>
                    <Grid item xs={12}><TextField fullWidth required name="title" label="Title" value={documentForm.title} onChange={changeDocumentForm} inputProps={{ maxLength: 160 }} /></Grid>
                    <Grid item xs={12}><TextField fullWidth name="fileUrl" label="Secure document URL (optional)" type="url" value={documentForm.fileUrl} onChange={changeDocumentForm} helperText="Use a protected document link. Never enter bank credentials." /></Grid>
                    <Grid item xs={12}><TextField fullWidth name="notes" label="Notes (optional)" value={documentForm.notes} onChange={changeDocumentForm} multiline minRows={2} /></Grid>
                  </Grid>
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}><Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={loading}>{editingDocumentId ? "Save changes" : "Add document"}</Button>{editingDocumentId && <Button onClick={resetDocumentForm}>Cancel</Button>}</Stack>
                </Paper>
              </>}
              {activeSection === "users" && isPortalAdmin && <UserManagement />}
            </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
      </Stack>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")} message={notice} />
    </Container>
  );
};

export default Finanz;
