import React, { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchSingleMezmur } from "../../api/api";

const SingleMezmur = () => {
  const { id } = useParams();
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
    <Box component="article" sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography component="h1" variant="h3" align="center" gutterBottom>{mezmur.title}</Typography>
      {mezmur.artist && <Typography color="text.secondary" align="center" gutterBottom>{mezmur.artist}</Typography>}
      <Typography component="div" sx={{ whiteSpace: "pre-wrap", fontSize: { xs: 18, md: 22 }, lineHeight: 1.8 }}>{mezmur.langetext}</Typography>
    </Box>
  );
};

export default SingleMezmur;
