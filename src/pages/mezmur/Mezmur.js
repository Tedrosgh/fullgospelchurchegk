import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
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
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteMezmurAction, getMezmurs } from "../../actions/postsActions";

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
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography component="h1" variant="h3">Mezmur</Typography>
        <Tooltip title={user?.result ? "Add a new mezmur" : "Sign in to add a mezmur"}>
          <IconButton
            color="primary"
            size="large"
            aria-label="Add a new mezmur"
            onClick={() => history.push(user?.result ? "/mezmur/addmezmur" : "/auth")}
            sx={{ border: 1, borderColor: "primary.main" }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        label="Search by title or artist"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && <Box sx={{ display: "grid", placeItems: "center", py: 6 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !mezmurs.length && <Alert severity="info">No songs found.</Alert>}

      {!!mezmurs.length && (
        <TableContainer component={Paper} elevation={2}>
          <Table aria-label="Mezmur songs">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
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
                  sx={{ cursor: "pointer" }}
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
