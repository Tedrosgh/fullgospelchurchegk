import React, { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { addMezmur, updateMezmur } from "../../actions/postsActions";
import { fetchSingleMezmur } from "../../api/api";

const initialState = { title: "", artist: "", writtenAt: "", langetext: "" };

const AddNewMezmur = () => {
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
            writtenAt: data.writtenAt || "",
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
      history.push("/mezmur");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add this song.");
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 760, mx: "auto", my: 4, p: { xs: 2, sm: 4 } }}>
      <Typography component="h1" variant="h4" gutterBottom>{isEditing ? "Modify mezmur" : "Add a new mezmur"}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <Typography>Loading song…</Typography> : (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField required name="title" label="Title" value={formData.title} onChange={handleChange} />
        <TextField name="artist" label="Artist" value={formData.artist} onChange={handleChange} />
        <TextField
          name="writtenAt"
          label="Date written"
          type="date"
          value={formData.writtenAt}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          helperText="Enter the historical date the song was written."
        />
        <TextField required multiline minRows={12} name="langetext" label="Lyrics" value={formData.langetext} onChange={handleChange} />
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button component={Link} to="/mezmur">Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>{submitting ? "Saving…" : isEditing ? "Save changes" : "Save song"}</Button>
        </Box>
      </Box>
      )}
    </Paper>
  );
};

export default AddNewMezmur;
