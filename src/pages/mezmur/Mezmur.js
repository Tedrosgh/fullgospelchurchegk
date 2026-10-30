import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteMezmurAction, getMezmurs } from "../../actions/postsActions";
import mezmurHero from "../../images/mezemran.jpg";
import { editorialShadow } from "../../theme";

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

const Mezmur = ({ adminMode = false, embedded = false, canDelete = false }) => {
  const location = useLocation();
  const savedList = location.state?.mezmurList;
  const [query, setQuery] = useState(savedList?.query || "");
  const [page, setPage] = useState(savedList?.page || 1);
  const restoreScroll = useRef(savedList?.scrollY);
  const listTop = useRef(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMezmur, setSelectedMezmur] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
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

  const pageCount = Math.max(1, Math.ceil(mezmurs.length / 30));
  const currentPage = Math.min(page, pageCount);
  const visibleMezmurs = mezmurs.slice((currentPage - 1) * 30, currentPage * 30);

  useEffect(() => {
    if (loading || error || !mezmurs.length || restoreScroll.current == null) return undefined;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: restoreScroll.current, left: 0, behavior: "auto" });
      restoreScroll.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, error, mezmurs.length]);

  const saveList = (nextQuery, nextPage, scrollY) => {
    history.replace({ ...location, state: { ...location.state, mezmurList: { query: nextQuery, page: nextPage, scrollY } } });
  };

  const openSong = (id, edit = adminMode) => {
    saveList(query, currentPage, window.scrollY);
    history.push(edit ? `/admin/mezmur/${id}/edit` : `/mezmur/${id}`, { fromMezmurList: true });
  };

  const changePage = (event, nextPage) => {
    setPage(nextPage);
    saveList(query, nextPage, undefined);
    listTop.current?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  const pagination = (position) => !!mezmurs.length && (
    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <Pagination aria-label={`${position} song pages`} count={pageCount} page={currentPage} onChange={changePage} color="primary" size={isMobile ? "small" : "medium"} siblingCount={isMobile ? 0 : 1} />
    </Box>
  );

  const openActions = (event, mezmur) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMezmur(mezmur);
  };

  const closeActions = () => {
    setMenuAnchor(null);
    setSelectedMezmur(null);
  };

  const removeSelectedMezmur = async () => {
    if (!canDelete) return;
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
    <Box sx={{ py: embedded ? 0 : { xs: 1, md: 3 }, pb: embedded ? 2 : 7 }}>
      {!embedded &&
      <Box sx={{ minHeight: { xs: 380, md: 480 }, borderRadius: 1, overflow: "hidden", display: "flex", alignItems: "flex-end", color: "common.white", mb: 4, backgroundImage: `linear-gradient(90deg, rgba(36,37,54,.92), rgba(63,53,65,.62) 55%, rgba(36,37,54,.22)), url(${mezmurHero})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: editorialShadow }}>
        <Box sx={{ p: { xs: 3, sm: 5, md: 6 }, maxWidth: 760 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: 0, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.5)", color: "white", mb: 2 }}><MusicNoteOutlinedIcon fontSize="large" /></Box>
          <Typography component="h1" fontWeight={900} sx={{ fontSize: { xs: "2.9rem", md: "4.8rem" }, lineHeight: .95, textTransform: "uppercase" }}>Mezmur</Typography>
          <Typography variant="h6" sx={{ mt: 1.5, color: "rgba(255,255,255,.86)", maxWidth: 620 }}>Songs of worship, faith, and hope from our church community.</Typography>
        </Box>
      </Box>}

      <Paper ref={listTop} elevation={0} sx={{ scrollMarginTop: 24, p: { xs: 2, sm: 2.5 }, mb: 3, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, gap: 2 }}>
          <TextField fullWidth label="Search by title or artist" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); saveList(event.target.value, 1, undefined); }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{mezmurs.length} songs</Typography>
        </Box>
      </Paper>

      {loading && <Box sx={{ display: "grid", placeItems: "center", py: 6 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !mezmurs.length && <Alert severity="info">No songs found.</Alert>}

      {pagination("Top")}

      {!!mezmurs.length && (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider", overflowX: "auto" }}>
          <Table aria-label="Mezmur songs">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg, #292a3e, #4b414e)" }}>
                {['Title', 'Artist', 'Created at', 'Action'].map((heading) => (
                  <TableCell key={heading} sx={{ color: "primary.contrastText", fontWeight: 700 }}>{heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleMezmurs.map((mezmur) => (
                <TableRow
                  key={mezmur._id}
                  hover
                  role="link"
                  tabIndex={0}
                  aria-label={`${adminMode ? "Edit" : "View"} ${mezmur.title || "mezmur"}`}
                  onClick={() => openSong(mezmur._id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openSong(mezmur._id);
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

      {pagination("Bottom")}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeActions}>
        <MenuItem onClick={() => { const id = selectedMezmur?._id; closeActions(); if (id) openSong(id, false); }}>View</MenuItem>
        {adminMode && <MenuItem onClick={() => { const id = selectedMezmur?._id; closeActions(); if (id) openSong(id, true); }}>Edit title & lyrics</MenuItem>}
        {adminMode && canDelete && <MenuItem onClick={removeSelectedMezmur}>Delete</MenuItem>}
        <MenuItem onClick={() => { const mezmur = selectedMezmur; closeActions(); if (mezmur) exportAsPdf(mezmur); }}>Export as PDF</MenuItem>
      </Menu>
    </Box>
  );
};

export default Mezmur;
