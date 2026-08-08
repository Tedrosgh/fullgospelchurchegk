import React from "react";
import Post from "./Post/Post";
import { useSelector } from "react-redux";

import useStyles from "./stylesAllPosts";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";

const AllPosts = ({ setCurrentId }) => {
  const classes = useStyles(); //classes.container

  const { items: posts, loading, error } = useSelector(
    (state) => state.postReducer
  );

  if (loading) {
    return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!posts.length) {
    return <Typography sx={{ py: 4 }}>No announcements have been posted yet.</Typography>;
  }

  return (
    <Grid
      className={classes.mainContainer}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={6} md={6}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AllPosts;
