import React, { useEffect, useState } from "react";
import { Container, Grow, Grid } from "@material-ui/core";
import AllPosts from "../../components/Posts/AllPosts";
import Form from "../../components/Form/Form";
import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/postsActions";

const Home = () => {
  const [currentId, setCurrentId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  return (
    <Grow in>
      <Container>
        <Grid
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={7}>
            <AllPosts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
