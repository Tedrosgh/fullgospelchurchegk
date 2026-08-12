import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";
import {
  deletePostAction,
  likePostAction,
} from "../../../actions/postsActions";

import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";

const Post = ({ post, setCurrentId, adminMode = false, canDelete = false, onMoveUp, onMoveDown, disableMoveUp, disableMoveDown }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

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
      sx={{ cursor: "pointer", bgcolor: palette.background, color: palette.text, minHeight: 455, height: "100%", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", borderRadius: 1, border: "1px solid", borderColor: "divider", boxShadow: "none", transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-5px)", boxShadow: "0 18px 45px rgba(34,35,53,.14)" } }}
    >
      <CardMedia
        image={post.selectedFile}
        title={post.title}
        sx={{ height: 0, pt: "56.25%", bgcolor: "rgba(0,0,0,.5)", backgroundBlendMode: "darken" }}
      />

      <div style={{ position: "absolute", top: 20, left: 20, color: "white" }}>
        <Typography variant="body2">{post.name}</Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>

      <div style={{ position: "absolute", top: 20, right: 20, color: "white" }}>
        {adminMode && (
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

      <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
        <Typography variant="body2" component="h2" style={{ color: palette.accent, fontWeight: 600 }}>
          {post.tags?.map((tag) => `የሱስ ህያው እዩ! - ${tag} `)}
        </Typography>
      </div>

      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        sx={{ px: 2, color: palette.text, fontWeight: 700, minHeight: 58, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {post.title}
      </Typography>

      <CardContent>
        <Typography variant="body2" component="p" sx={{ color: palette.text, lineHeight: 1.6, height: 68, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.message}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1, mt: "auto", justifyContent: "space-between" }}>
        <Button
          size="small"
          color="primary"
          style={{ color: palette.accent }}
          onClick={(event) => {
            event.stopPropagation();
            if (!user?.result) history.push("/auth", { from: location.pathname });
            else dispatch(likePostAction(post._id));
          }}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Likes />
        </Button>

        {adminMode && (<>
          <Button size="small" style={{ color: palette.accent, minWidth: 32 }} disabled={disableMoveUp} onClick={(event) => { event.stopPropagation(); onMoveUp?.(); }} aria-label="Move announcement up"><ArrowUpwardIcon fontSize="small" /></Button>
          <Button size="small" style={{ color: palette.accent, minWidth: 32 }} disabled={disableMoveDown} onClick={(event) => { event.stopPropagation(); onMoveDown?.(); }} aria-label="Move announcement down"><ArrowDownwardIcon fontSize="small" /></Button>
          {canDelete && <Button
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
          </Button>}
        </>)}
      </CardActions>
    </Card>
  );
};

export default Post;
