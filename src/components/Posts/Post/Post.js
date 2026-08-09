import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useStyles from "./stylesPost";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import {
  deletePostAction,
  likePostAction,
} from "../../../actions/postsActions";

import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("profile"));
  const cardPalettes = [
    { background: "#fff8e1", text: "#3e2723", accent: "#9a4d00" },
    { background: "#e8f5e9", text: "#17351b", accent: "#1b5e20" },
    { background: "#e3f2fd", text: "#102a43", accent: "#0d47a1" },
    { background: "#f3e5f5", text: "#32133b", accent: "#6a1b9a" },
  ];
  const paletteIndex = [...String(post._id || post.title || "")]
    .reduce((total, character) => total + character.charCodeAt(0), 0) % cardPalettes.length;
  const palette = cardPalettes[paletteIndex];

  const Likes = () => {
    if (post.likes?.length > 0) {
      return post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {post.likes.length > 2
            ? `You and ${post.likes.length - 1} others`
            : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }
    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  return (
    <Card
      className={classes.card}
      role="link"
      tabIndex={0}
      aria-label={`View ${post.title || "card"}`}
      onClick={() => history.push(`/posts/${post._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          history.push(`/posts/${post._id}`);
        }
      }}
      style={{ cursor: "pointer", backgroundColor: palette.background, color: palette.text }}
    >
      <CardMedia
        className={classes.media}
        image={post.selectedFile}
        title={post.title}
      />

      <div className={classes.overlay}>
        <Typography variant="body2">{post.name}</Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>

      <div className={classes.overlay2}>
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            style={{ color: "white" }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setCurrentId(post._id);
            }}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        )}
      </div>

      <div className={classes.details}>
        <Typography variant="body2" component="h2" style={{ color: palette.accent, fontWeight: 600 }}>
          {post.tags?.map((tag) => `የሱስ ህያው እዩ! - ${tag} `)}
        </Typography>
      </div>

      <Typography
        className={classes.title}
        gutterBottom
        variant="h5"
        component="h2"
        style={{ color: palette.text, fontWeight: 700 }}
      >
        {post.title}
      </Typography>

      <CardContent>
        <Typography variant="body2" component="p" style={{ color: palette.text, lineHeight: 1.6 }}>
          {post.message}
        </Typography>
      </CardContent>

      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          style={{ color: palette.accent }}
          onClick={(event) => {
            event.stopPropagation();
            if (!user?.result) history.push("/auth");
            else dispatch(likePostAction(post._id));
          }}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Likes />
        </Button>

        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            size="small"
            color="primary"
            style={{ color: palette.accent }}
            onClick={(event) => {
              event.stopPropagation();
              if (window.confirm("Delete this post permanently?")) {
                dispatch(deletePostAction(post._id));
              }
            }}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
