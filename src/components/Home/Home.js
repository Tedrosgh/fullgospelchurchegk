import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AllPosts from "../../components/Posts/AllPosts";
import { getPosts } from "../../actions/postsActions";
import heroImage from "../../images/pasAbr.jpg";

const pathways = [
  {
    title: "Worship with us",
    text: "Join our church family for prayer, worship, and fellowship in Cologne.",
    path: "/program",
    action: "View program",
    icon: <ChurchOutlinedIcon fontSize="large" />,
    color: "#0d47a1",
  },
  {
    title: "Songs of faith",
    text: "Read, learn, and share our growing collection of Eritrean worship songs.",
    path: "/mezmur",
    action: "Explore Mezmur",
    icon: <MusicNoteOutlinedIcon fontSize="large" />,
    color: "#7b1fa2",
  },
  {
    title: "Children & youth",
    text: "Discover welcoming spaces where the next generation can grow in faith.",
    path: "/kinder",
    action: "Learn more",
    icon: <GroupsOutlinedIcon fontSize="large" />,
    color: "#00838f",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Box sx={{ pb: 7 }}>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 540, md: 650 },
          borderRadius: { xs: 3, md: 4 },
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          color: "common.white",
          bgcolor: "#051223",
          boxShadow: "0 24px 70px rgba(9,30,66,.24)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-5%",
            zIndex: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.02) translate3d(0, 0, 0)",
            animation: "homeHeroMotion 24s ease-in-out infinite alternate",
            willChange: "transform",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(90deg, rgba(5,18,35,.92) 0%, rgba(5,25,48,.72) 48%, rgba(5,18,35,.22) 100%)",
            pointerEvents: "none",
          },
          "@keyframes homeHeroMotion": {
            "0%": { transform: "scale(1.02) translate3d(-1%, 0, 0)" },
            "100%": { transform: "scale(1.13) translate3d(1.5%, -1.5%, 0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            "&::before": { animation: "none", transform: "scale(1.04)" },
          },
        }}
      >
        <Box sx={{ p: { xs: 3, sm: 6, md: 8 }, maxWidth: 760, position: "relative", zIndex: 2 }}>
          <Chip label="A church family in Cologne" sx={{ mb: 2.5, bgcolor: "rgba(255,255,255,.15)", color: "white", fontWeight: 700 }} />
          <Typography component="h1" fontWeight={900} sx={{ fontSize: { xs: "2.7rem", sm: "4.2rem", md: "5rem" }, lineHeight: 0.98, letterSpacing: "-.04em" }}>
            Welcome home.
            <Box component="span" sx={{ display: "block", color: "#ffca28" }}>There is a place for you.</Box>
          </Typography>
          <Typography variant="h6" sx={{ mt: 3, maxWidth: 620, lineHeight: 1.6, color: "rgba(255,255,255,.88)" }}>
            Eritrean Full Gospel Church Cologne is a community growing together through worship, God’s Word, prayer, and service.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4, alignItems: { xs: "stretch", sm: "center" } }}>
            <Button component={Link} to="/program" size="large" variant="contained" color="warning" endIcon={<ArrowForwardIcon />}>Plan your visit</Button>
            <Button href="https://www.google.com/maps/search/?api=1&query=Im+Weidenbruch+4%2C+51061+K%C3%B6ln" target="_blank" rel="noopener noreferrer" size="large" variant="outlined" color="inherit" startIcon={<LocationOnOutlinedIcon />}>Get directions</Button>
          </Stack>
        </Box>
      </Box>

      <Paper elevation={4} sx={{ mx: { xs: 1.5, md: 6 }, mt: { xs: -2, md: -4 }, p: { xs: 2.5, md: 3 }, position: "relative", zIndex: 2, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}><Stack direction="row" spacing={1.5} alignItems="center"><CalendarMonthOutlinedIcon color="primary" /><Box><Typography variant="overline" color="text.secondary">Weekly gathering</Typography><Typography fontWeight={800}>Sunday · 14:30–17:00</Typography></Box></Stack></Grid>
          <Grid item xs={12} md={4}><Stack direction="row" spacing={1.5} alignItems="center"><LocationOnOutlinedIcon color="primary" /><Box><Typography variant="overline" color="text.secondary">Our location</Typography><Typography fontWeight={800}>Im Weidenbruch 4, Köln</Typography></Box></Stack></Grid>
          <Grid item xs={12} md={4}><Button component={Link} to="/program" fullWidth variant="contained" size="large">See the full weekly program</Button></Grid>
        </Grid>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
        <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 4 }}>
          <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={2}>Connect and grow</Typography>
          <Typography variant="h3" component="h2" fontWeight={850} sx={{ mt: 0.5, fontSize: { xs: "2rem", md: "3rem" } }}>Take your next step</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: "1.05rem" }}>Whether this is your first visit or your church home, there is a meaningful way to participate.</Typography>
        </Box>
        <Grid container spacing={3}>
          {pathways.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid", borderColor: "divider", transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-6px)", boxShadow: 8 } }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ width: 62, height: 62, display: "grid", placeItems: "center", borderRadius: 2.5, color: item.color, bgcolor: `${item.color}14`, mb: 2.5 }}>{item.icon}</Box>
                  <Typography variant="h5" fontWeight={800}>{item.title}</Typography>
                  <Typography color="text.secondary" sx={{ my: 1.5, lineHeight: 1.7 }}>{item.text}</Typography>
                  <Button component={Link} to={item.path} endIcon={<ArrowForwardIcon />} sx={{ px: 0 }}>{item.action}</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="section" sx={{ mt: { xs: 7, md: 10 }, py: { xs: 6, md: 8 }, px: { xs: 2, md: 5 }, borderRadius: 4, bgcolor: "#102a43", color: "common.white", textAlign: "center" }}>
        <VolunteerActivismOutlinedIcon sx={{ fontSize: 48, color: "#ffca28" }} />
        <Typography variant="h3" fontWeight={850} sx={{ mt: 1, fontSize: { xs: "2rem", md: "3rem" } }}>Faith grows in community.</Typography>
        <Typography sx={{ mt: 1.5, mx: "auto", maxWidth: 700, color: "rgba(255,255,255,.76)", fontSize: "1.08rem" }}>Come as you are. Worship with us, meet the community, and discover a place where your family can belong.</Typography>
        <Button component={Link} to="/help" variant="contained" color="warning" size="large" sx={{ mt: 3 }}>Contact our church</Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 7, md: 10 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="primary" fontWeight={800} letterSpacing={2}>Community updates</Typography>
          <Typography variant="h3" component="h2" fontWeight={850} sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>Latest announcements</Typography>
        </Box>
        <AllPosts />
      </Container>
    </Box>
  );
};

export default Home;
