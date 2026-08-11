import React, { useState } from "react";
import { Alert, Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { addMezmur, updateMezmur } from "../../actions/postsActions";
import { fetchSingleMezmur } from "../../api/api";

const initialState = { title: "", artist: "", langetext: "" };

const AddNewMezmur = ({ embedded = false }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  React.useEffect(() => {
    if (!id) return undefined;
    let active = true;
    fetchSingleMezmur(id)
      .then(({ data }) => {
        if (active) {
          setFormData({
            title: data.title || "",
            artist: data.artist || "",
            langetext: data.langetext || "",
          });
          setLoading(false);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load this song.");
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [id]);

  if (!user?.result?.name) {
    return (
      <Alert severity="warning" sx={{ my: 4 }}>
        Please <Link to="/auth">sign in</Link> to add a song.
      </Alert>
    );
  }

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...formData, name: user.result.name };
      await dispatch(isEditing ? updateMezmur(id, payload) : addMezmur(payload));
      history.push("/admin");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add this song.");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", my: embedded ? 0 : { xs: 2, md: 4 }, pb: embedded ? 2 : 6 }}>
    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px 24px 0 0", color: "common.white", background: "linear-gradient(120deg, #311b92, #1565c0 65%, #00897b)" }}>
      <Button component={Link} to="/admin" color="inherit" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Back to Admin Portal</Button>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: "#ffca28", color: "#24164f", display: "grid", placeItems: "center" }}><MusicNoteOutlinedIcon /></Box>
        <Box><Chip label={isEditing ? "Edit song" : "New song"} size="small" sx={{ mb: 0.75, bgcolor: "rgba(255,255,255,.16)", color: "white" }} /><Typography component="h1" variant="h4" fontWeight={850}>{isEditing ? "Modify Mezmur" : "Add a new Mezmur"}</Typography></Box>
      </Stack>
    </Paper>
    <Paper elevation={4} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: "0 0 24px 24px" }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <Typography>Loading song…</Typography> : (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField required name="title" label="Title" value={formData.title} onChange={handleChange} />
        <TextField name="artist" label="Artist" value={formData.artist} onChange={handleChange} />
        <TextField required multiline minRows={12} name="langetext" label="Lyrics" value={formData.langetext} onChange={handleChange} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-end" }}>
          <Button component={Link} to="/admin">Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>{submitting ? "Saving…" : isEditing ? "Save changes" : "Save song"}</Button>
        </Box>
      </Box>
      )}
    </Paper>
    </Box>
  );
};

export default AddNewMezmur;
