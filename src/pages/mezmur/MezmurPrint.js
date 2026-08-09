import React, { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { fetchSingleMezmur } from "../../api/api";

const MezmurPrint = () => {
  const { id } = useParams();
  const [mezmur, setMezmur] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchSingleMezmur(id)
      .then(({ data }) => active && setMezmur(data))
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to prepare this song for printing.");
      });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!mezmur) return undefined;
    document.title = `${mezmur.title || "Mezmur"} - PDF`;
    const timer = setTimeout(() => window.print(), 400);
    return () => clearTimeout(timer);
  }, [mezmur]);

  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!mezmur) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "70vh" }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 3, sm: 6 }, bgcolor: "white", color: "black", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 4, "@media print": { display: "none" } }}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Print / Save as PDF</Button>
        <Button startIcon={<CloseIcon />} onClick={() => window.close()}>Close</Button>
      </Box>
      <Typography component="h1" variant="h3" gutterBottom>{mezmur.title || "Untitled"}</Typography>
      {(mezmur.artist || mezmur.name) && (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {[mezmur.artist, mezmur.name].filter(Boolean).join(" · ")}
        </Typography>
      )}
      <Typography component="div" sx={{ whiteSpace: "pre-wrap", fontSize: 18, lineHeight: 1.7 }}>
        {mezmur.langetext}
      </Typography>
    </Box>
  );
};

export default MezmurPrint;
