import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { editorialGradient, editorialShadow } from "../theme";

const NotFound = () => (
  <Box sx={{ py: { xs: 5, md: 10 }, textAlign: "center" }}>
    <Paper sx={{ maxWidth: 700, mx: "auto", p: { xs: 4, md: 7 }, borderRadius: 1, color: "common.white", background: editorialGradient, boxShadow: editorialShadow }}>
      <Typography component="h1" fontWeight={950} sx={{ fontSize: { xs: "5rem", md: "8rem" }, lineHeight: 1, color: "#ffd166" }}>404</Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>This page could not be found.</Typography>
      <Typography sx={{ my: 2.5, opacity: .8 }}>The link may be outdated, or the page may have moved.</Typography>
      <Button component={Link} to="/" variant="contained" color="warning" size="large">Return home</Button>
    </Paper>
  </Box>
);

export default NotFound;
