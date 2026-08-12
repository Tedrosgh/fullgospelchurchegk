import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import { useHistory, useParams } from "react-router-dom";
import { fetchSingleMezmur } from "../../api/api";
import { editorialGradient, editorialShadow } from "../../theme";

const SingleMezmur = () => {
  const { id } = useParams();
  const history = useHistory();
  const [mezmur, setMezmur] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    fetchSingleMezmur(id)
      .then(({ data }) => active && setMezmur(data))
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load this song.");
      });
    return () => { active = false; };
  }, [id]);

  if (error) return <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>;
  if (!mezmur) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <Box component="article" sx={{ maxWidth: 900, mx: "auto", py: { xs: 2, md: 4 }, pb: 7 }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 1, color: "common.white", background: editorialGradient, boxShadow: editorialShadow }}>
        <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 3 }}>Back to Mezmur</Button>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: 0, bgcolor: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.45)", color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}><MusicNoteOutlinedIcon fontSize="large" /></Box>
          <Box>
            <Chip label="Worship song" size="small" sx={{ mb: 1, bgcolor: "rgba(255,255,255,.16)", color: "white" }} />
            <Typography component="h1" variant="h3" fontWeight={850}>{mezmur.title}</Typography>
            {mezmur.artist && <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,.78)" }}>{mezmur.artist}</Typography>}
          </Box>
        </Stack>
      </Paper>
      <Paper elevation={0} sx={{ mt: 3, p: { xs: 3, sm: 5, md: 6 }, borderRadius: 1, border: "1px solid", borderColor: "divider", borderTop: "4px solid #d7a44a" }}>
        <Typography component="div" sx={{ whiteSpace: "pre-wrap", fontSize: { xs: 18, md: 22 }, lineHeight: 1.9, color: "#243b53" }}>{mezmur.langetext}</Typography>
      </Paper>
    </Box>
  );
};

export default SingleMezmur;
