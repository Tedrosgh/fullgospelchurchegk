import React, { useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { addMezmur } from "../../actions/postsActions";

const initialState = { title: "", artist: "", langetext: "" };

const AddNewMezmur = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      await dispatch(addMezmur({ ...formData, name: user.result.name }));
      history.push("/mezmur");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add this song.");
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 760, mx: "auto", my: 4, p: { xs: 2, sm: 4 } }}>
      <Typography component="h1" variant="h4" gutterBottom>Add a new mezmur</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <TextField required name="title" label="Title" value={formData.title} onChange={handleChange} />
        <TextField name="artist" label="Artist" value={formData.artist} onChange={handleChange} />
        <TextField required multiline minRows={12} name="langetext" label="Lyrics" value={formData.langetext} onChange={handleChange} />
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button component={Link} to="/mezmur">Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>{submitting ? "Saving…" : "Save song"}</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddNewMezmur;
