import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory, useParams } from "react-router-dom";
import { fetchSinglePost } from "../api/api";

const PostDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchSinglePost(id)
      .then(({ data }) => active && setPost(data))
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Unable to load this card.");
      });
    return () => { active = false; };
  }, [id]);

  if (error) return <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>;
  if (!post) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 2, md: 4 }, pb: 7 }}>
      <Box sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, color: "common.white", background: "linear-gradient(120deg, #311b92, #1565c0 65%, #00897b)", boxShadow: "0 20px 50px rgba(49,27,146,.2)" }}>
        <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 2 }}>Back to announcements</Button>
        <Typography variant="overline" sx={{ opacity: .75, letterSpacing: 2, fontWeight: 800 }}>Community update</Typography>
        <Typography component="h1" variant="h3" fontWeight={850}>{post.title}</Typography>
        <Typography sx={{ mt: 1, opacity: .78 }}>{post.name}</Typography>
      </Box>
      <Card elevation={4} sx={{ borderRadius: 4, overflow: "hidden", borderTop: "5px solid #ffca28" }}>
        {post.selectedFile && <CardMedia component="img" image={post.selectedFile} alt={post.title || "Church post"} sx={{ maxHeight: 520, objectFit: "cover" }} />}
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography sx={{ whiteSpace: "pre-wrap", my: 3 }}>{post.message}</Typography>
          {!!post.tags?.length && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {post.tags.map((tag) => <Chip key={tag} label={`#${tag}`} />)}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostDetail;
