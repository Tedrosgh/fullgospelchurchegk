import { useEffect, useState } from "react";
import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import { useDispatch, useSelector } from "react-redux";
import AllPosts from "../../components/Posts/AllPosts";
import Form from "../../components/Form/Form";
import { getPosts } from "../../actions/postsActions";
import { updateAnnouncementOrder } from "../../api/api";

const AnnouncementManagement = ({ canDelete }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer.items);
  const [currentId, setCurrentId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { dispatch(getPosts()); }, [dispatch]);

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= posts.length) return;
    const reordered = [...posts];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    try {
      await updateAnnouncementOrder(reordered.map((post) => post._id));
      await dispatch(getPosts());
      setFeedback({ severity: "success", message: "Announcement order updated." });
    } catch (error) {
      setFeedback({ severity: "error", message: error.response?.data?.message || "Announcement order could not be updated." });
    }
  };

  return <Box>
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, color: "common.white", background: "linear-gradient(120deg, #7c2d12, #ea580c)" }}>
      <CampaignOutlinedIcon sx={{ fontSize: 42 }} />
      <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>Announcements</Typography>
      <Typography sx={{ opacity: 0.82 }}>Create, edit, remove, and arrange the updates shown on the Home page.</Typography>
    </Paper>
    {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ mb: 2 }}>{feedback.message}</Alert>}
    <Grid container spacing={3} alignItems="flex-start">
      <Grid item xs={12} lg={8}><AllPosts adminMode canDelete={canDelete} setCurrentId={setCurrentId} onMoveUp={(index) => move(index, -1)} onMoveDown={(index) => move(index, 1)} /></Grid>
      <Grid item xs={12} lg={4} sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}><Form currentId={currentId} setCurrentId={setCurrentId} /></Grid>
    </Grid>
  </Box>;
};

export default AnnouncementManagement;
