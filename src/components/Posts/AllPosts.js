import React from "react";
import Post from "./Post/Post";
import { useSelector } from "react-redux";

import useStyles from "./stylesAllPosts";
import { Grid, CircularProgress } from "@material-ui/core";

const AllPosts = ({ setCurrentId }) => {
  const classes = useStyles(); //classes.container

  const posts = useSelector((state) => state.postReducer);
  console.log("All posts: ", posts);

  return !posts.length ? (
    <CircularProgress />
  ) : (
    <Grid
      className={classes.container}
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
