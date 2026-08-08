import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteMezmurAction, getMezmurs } from "../../actions/postsActions";

const Mezmur = () => {
  const [query, setQuery] = useState("");
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
      .filter((item) => (item.title || "").toLocaleLowerCase().includes(normalizedQuery))
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [items, query]);

  const removeMezmur = async (id) => {
    if (!window.confirm("Delete this song permanently?")) return;
    try {
      await dispatch(deleteMezmurAction(id));
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || "Unable to delete this song.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 3 }}>
        <Typography component="h1" variant="h3">Mezmur</Typography>
        {user?.result && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => history.push("/mezmur/addmezmur")}>Add song</Button>
        )}
      </Box>
      <TextField fullWidth label="Search songs" value={query} onChange={(event) => setQuery(event.target.value)} sx={{ mb: 3 }} />
      {loading && <Box sx={{ display: "grid", placeItems: "center", py: 6 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !mezmurs.length && <Alert severity="info">No songs found.</Alert>}
      {!!mezmurs.length && (
        <Paper>
          <List disablePadding>
            {mezmurs.map((mezmur, index) => (
              <ListItem key={mezmur._id} divider={index < mezmurs.length - 1} secondaryAction={user?.result?._id === mezmur.creator && (
                <IconButton aria-label={`Delete ${mezmur.title}`} onClick={() => removeMezmur(mezmur._id)}><DeleteIcon color="error" /></IconButton>
              )}>
                <ListItemText primary={<Link to={`/mezmur/${mezmur._id}`}>{mezmur.title}</Link>} secondary={mezmur.artist} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Mezmur;
