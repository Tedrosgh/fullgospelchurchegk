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
    <Box sx={{ maxWidth: 850, mx: "auto", py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 3 }}>Back</Button>
      <Card>
        {post.selectedFile && <CardMedia component="img" image={post.selectedFile} alt={post.title || "Church post"} sx={{ maxHeight: 520, objectFit: "cover" }} />}
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography component="h1" variant="h3" gutterBottom>{post.title}</Typography>
          <Typography color="text.secondary" gutterBottom>{post.name}</Typography>
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
