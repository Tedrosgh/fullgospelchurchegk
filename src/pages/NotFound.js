import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Box sx={{ py: 10, textAlign: "center" }}>
    <Typography component="h1" variant="h2">404</Typography>
    <Typography variant="h5" sx={{ mb: 3 }}>This page could not be found.</Typography>
    <Button component={Link} to="/" variant="contained">Return home</Button>
  </Box>
);

export default NotFound;
