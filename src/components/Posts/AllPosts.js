import React from "react";
import Post from "./Post/Post";
import { useSelector } from "react-redux";

import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";

const AllPosts = ({ setCurrentId, adminMode = false, canDelete = false, onMoveUp, onMoveDown }) => {
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
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.map((post, index) => (
        <Grid key={post._id} item xs={12} sm={6} md={adminMode ? 6 : 4}>
          <Post post={post} setCurrentId={setCurrentId} adminMode={adminMode} canDelete={canDelete} onMoveUp={() => onMoveUp?.(index)} onMoveDown={() => onMoveDown?.(index)} disableMoveUp={index === 0} disableMoveDown={index === posts.length - 1} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AllPosts;
