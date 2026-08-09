import React, { useState, useEffect } from "react";
import useStyles from "./stylesForm";
import { TextField, Button, Typography, Paper } from "@mui/material";
import FileBase from "react-file-base64";

import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/postsActions";
import { Link, useLocation } from "react-router-dom";

const Form = ({ currentId, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const location = useLocation();

  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });

  const post = useSelector((state) =>
    currentId ? state.postReducer.items.find((p) => p._id === currentId) : null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);

  const classes = useStyles();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...postData, name: user?.result?.name };
      await dispatch(currentId ? updatePost(currentId, payload) : createPost(payload));
      clear();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this post.");
    } finally {
      setSubmitting(false);
    }
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  if (!user?.result?.name) {
    //Please sign in
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own cards and like other's cards
        </Typography>
        <Button component={Link} to={{ pathname: "/auth", state: { from: location.pathname } }} variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign In
        </Button>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.form} ${classes.root}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h5">
          {currentId ? `Editing` : `Creating`} Image Card
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {/* <TextField
          name="creator"
          variant="outlined"
          label="Creator"
          fullWidth
          value={postData.creator}
          onChange={(e) =>
            setPostData({ ...postData, creator: e.target.value })
          }
        />  */}
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>

        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Submit"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
