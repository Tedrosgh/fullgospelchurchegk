import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
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
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteMezmurAction, getMezmurs } from "../../actions/postsActions";
import mezmurHero from "../../images/mezemran.jpg";

const formatCreatedAt = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const exportAsPdf = (mezmur) => {
  const printWindow = window.open(`/mezmur/${mezmur._id}/print`, "_blank");
  if (!printWindow) {
    window.alert("Allow pop-ups to export this song as PDF.");
    return;
  }
  printWindow.opener = null;
};

const Mezmur = () => {
  const [query, setQuery] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMezmur, setSelectedMezmur] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const { items, loading, error } = useSelector((state) => state.mezmurReducer);

  useEffect(() => {
    dispatch(getMezmurs());
  }, [dispatch]);

  const mezmurs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...items]
      .filter((item) =>
        [item.title, item.artist]
          .filter(Boolean)
          .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
      )
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [items, query]);

  const openActions = (event, mezmur) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMezmur(mezmur);
  };

  const closeActions = () => {
    setMenuAnchor(null);
    setSelectedMezmur(null);
  };

  const ownsSelectedMezmur =
    Boolean(user?.result?._id) && user.result._id === selectedMezmur?.creator;

  const removeSelectedMezmur = async () => {
    const mezmur = selectedMezmur;
    closeActions();
    if (!mezmur || !window.confirm(`Delete “${mezmur.title}” permanently?`)) return;
    try {
      await dispatch(deleteMezmurAction(mezmur._id));
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || "Unable to delete this song.");
    }
  };

  return (
    <Box sx={{ py: { xs: 1, md: 3 }, pb: 7 }}>
      <Box sx={{ minHeight: { xs: 330, md: 420 }, borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "flex-end", color: "common.white", mb: 4, backgroundImage: `linear-gradient(90deg, rgba(17,11,53,.94), rgba(74,20,140,.72) 52%, rgba(0,105,92,.25)), url(${mezmurHero})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 24px 65px rgba(49,27,146,.22)" }}>
        <Box sx={{ p: { xs: 3, sm: 5, md: 6 }, maxWidth: 760 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "#ffca28", color: "#24164f", mb: 2 }}><MusicNoteOutlinedIcon fontSize="large" /></Box>
          <Typography component="h1" fontWeight={900} sx={{ fontSize: { xs: "2.7rem", md: "4.2rem" }, lineHeight: 1 }}>Mezmur</Typography>
          <Typography variant="h6" sx={{ mt: 1.5, color: "rgba(255,255,255,.86)", maxWidth: 620 }}>Songs of worship, faith, and hope from our church community.</Typography>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 2.5 }, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, gap: 2 }}>
          <TextField fullWidth label="Search by title or artist" value={query} onChange={(event) => setQuery(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{mezmurs.length} songs</Typography>
          <Tooltip title={user?.result ? "Add a new mezmur" : "Sign in to add a mezmur"}>
            <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => history.push(user?.result ? "/mezmur/addmezmur" : "/auth")} sx={{ whiteSpace: "nowrap", borderRadius: 99, px: 3 }}>Add Mezmur</Button>
          </Tooltip>
        </Box>
      </Paper>

      {loading && <Box sx={{ display: "grid", placeItems: "center", py: 6 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !mezmurs.length && <Alert severity="info">No songs found.</Alert>}

      {!!mezmurs.length && (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflowX: "auto" }}>
          <Table aria-label="Mezmur songs">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg, #311b92, #1565c0, #00897b)" }}>
                {['Title', 'Artist', 'Created at', 'Action'].map((heading) => (
                  <TableCell key={heading} sx={{ color: "primary.contrastText", fontWeight: 700 }}>{heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mezmurs.map((mezmur) => (
                <TableRow
                  key={mezmur._id}
                  hover
                  role="link"
                  tabIndex={0}
                  aria-label={`View ${mezmur.title || "mezmur"}`}
                  onClick={() => history.push(`/mezmur/${mezmur._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      history.push(`/mezmur/${mezmur._id}`);
                    }
                  }}
                  sx={{ cursor: "pointer", "&:nth-of-type(even)": { bgcolor: "rgba(21,101,192,.035)" } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>{mezmur.title || "Untitled"}</TableCell>
                  <TableCell>{mezmur.artist || "—"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatCreatedAt(mezmur.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowDropDownIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openActions(event, mezmur);
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeActions}>
        <MenuItem onClick={() => { const id = selectedMezmur?._id; closeActions(); if (id) history.push(`/mezmur/${id}`); }}>View</MenuItem>
        <MenuItem disabled={!ownsSelectedMezmur} onClick={() => { const id = selectedMezmur?._id; closeActions(); if (id) history.push(`/mezmur/${id}/edit`); }}>Modify</MenuItem>
        <MenuItem disabled={!ownsSelectedMezmur} onClick={removeSelectedMezmur}>Delete</MenuItem>
        <MenuItem onClick={() => { const mezmur = selectedMezmur; closeActions(); if (mezmur) exportAsPdf(mezmur); }}>Export as PDF</MenuItem>
      </Menu>
    </Box>
  );
};

export default Mezmur;
