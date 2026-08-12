import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AllPosts from "../../components/Posts/AllPosts";
import { getPosts } from "../../actions/postsActions";
import heroImage from "../../images/pasAbr.jpg";

const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Im+Weidenbruch+4%2C+51061+K%C3%B6ln";

const actions = [
  { title: "Plan your visit", text: "Times, location, and what to expect", path: "/program", icon: <CalendarMonthOutlinedIcon /> },
  { title: "Listen to a sermon", text: "Encouragement for your week", path: "/predict", icon: <HeadphonesOutlinedIcon /> },
  { title: "Explore Mezmur", text: "Songs of worship and faith", path: "/mezmur", icon: <MusicNoteOutlinedIcon /> },
  { title: "Get in touch", text: "Prayer, questions, or a conversation", path: "/help", icon: <VolunteerActivismOutlinedIcon /> },
];

const ministries = [
  {
    eyebrow: "WORSHIP",
    title: "A place to meet God",
    text: "Gather with us for worship, prayer, and a message rooted in God’s Word.",
    path: "/program",
    action: "View our program",
    icon: <ChurchOutlinedIcon fontSize="large" />,
    color: "#176b87",
    wash: "#e6f5f5",
  },
  {
    eyebrow: "COMMUNITY",
    title: "A family to belong to",
    text: "Build meaningful friendships and grow alongside a welcoming church family.",
    path: "/help",
    action: "Connect with us",
    icon: <VolunteerActivismOutlinedIcon fontSize="large" />,
    color: "#8a4b18",
    wash: "#fff2dc",
  },
  {
    eyebrow: "NEXT GENERATION",
    title: "A faith that grows",
    text: "Discover joyful, age-appropriate spaces for children and young people.",
    path: "/kinder",
    action: "Meet our ministries",
    icon: <GroupsOutlinedIcon fontSize="large" />,
    color: "#5f4a9a",
    wash: "#f0ebff",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Box sx={{ pb: { xs: 6, md: 10 } }}>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 690, md: "calc(100vh - 150px)" },
          borderRadius: { xs: 3, md: 5 },
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          color: "common.white",
          bgcolor: "#242536",
          isolation: "isolate",
          boxShadow: "0 32px 85px rgba(24,25,43,.28)",
          "&::before": {
            content: '""', position: "absolute", inset: "-5%", zIndex: -2,
            backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center 35%",
            filter: "saturate(.72)", animation: "homeHeroMotion 26s ease-in-out infinite alternate", willChange: "transform",
          },
          "&::after": {
            content: '""', position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(180deg, rgba(32,32,50,.38) 0%, rgba(38,31,49,.48) 48%, rgba(19,23,38,.68) 100%)",
          },
          "@keyframes homeHeroMotion": {
            "0%": { transform: "scale(1.03) translate3d(-1%, 0, 0)" },
            "100%": { transform: "scale(1.14) translate3d(1.5%, -1.5%, 0)" },
          },
          "@media (prefers-reduced-motion: reduce)": { "&::before": { animation: "none", transform: "scale(1.04)" } },
        }}
      >
        <Box sx={{ width: "100%", minHeight: "inherit", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", px: { xs: 2.5, sm: 5 }, py: { xs: 7, md: 9 }, position: "relative" }}>
          <Typography variant="overline" sx={{ mb: 2, fontSize: { xs: ".78rem", md: "1rem" }, color: "rgba(255,255,255,.92)", fontWeight: 800, letterSpacing: { xs: 4, md: 7 } }}>WELCOME TO</Typography>
          <Typography component="h1" fontWeight={900} sx={{ maxWidth: 1000, fontSize: { xs: "2.8rem", sm: "4.5rem", md: "6.2rem" }, lineHeight: .92, letterSpacing: { xs: "-.035em", md: "-.055em" }, textTransform: "uppercase", textShadow: "0 8px 35px rgba(0,0,0,.28)" }}>
            Eritrean Full Gospel
            <Box component="span" sx={{ display: "block" }}>Church Cologne</Box>
          </Typography>
          <Typography sx={{ mt: 3, maxWidth: 650, fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.7, color: "rgba(255,255,255,.84)" }}>
            A welcoming community growing together through worship, God’s Word, prayer, and everyday life.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3.5, alignItems: { xs: "stretch", sm: "center" }, width: { xs: "100%", sm: "auto" } }}>
            <Button component={Link} to="/program" size="large" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: "white", color: "#292a3e", px: 3.5, py: 1.25, fontWeight: 900, borderRadius: 0, "&:hover": { bgcolor: "#f3eee9", transform: "translateY(-2px)" } }}>Join us this Sunday</Button>
            <Button href={directionsUrl} target="_blank" rel="noopener noreferrer" size="large" variant="outlined" color="inherit" startIcon={<LocationOnOutlinedIcon />} sx={{ px: 3.5, py: 1.15, borderRadius: 0, borderColor: "rgba(255,255,255,.7)", bgcolor: "rgba(30,30,45,.14)", backdropFilter: "blur(5px)" }}>Get directions</Button>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: .5, sm: 3 }} sx={{ mt: 3, color: "rgba(255,255,255,.78)" }}>
            <Typography variant="body2" fontWeight={700}>Sunday · 14:30–17:00</Typography>
            <Typography variant="body2" fontWeight={700}>Im Weidenbruch 4 · 51061 Köln</Typography>
          </Stack>
          <Box component="a" href="#home-actions" aria-label="Explore the website" sx={{ position: "absolute", bottom: { xs: 18, md: 24 }, color: "white", height: 46, display: "grid", placeItems: "center", animation: "scrollCue 1.8s ease-in-out infinite", "@keyframes scrollCue": { "0%, 100%": { transform: "translateY(0)", opacity: .65 }, "50%": { transform: "translateY(7px)", opacity: 1 } }, "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}><KeyboardArrowDownRoundedIcon sx={{ fontSize: 42 }} /></Box>
        </Box>
      </Box>

      <Box id="home-actions" sx={{ mx: { xs: 1.5, md: 5 }, mt: { xs: -2, md: -3.5 }, position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, bgcolor: "white", borderRadius: 1, boxShadow: "0 18px 55px rgba(27,47,77,.15)", overflow: "hidden", scrollMarginTop: 120 }}>
        {actions.map((item, index) => (
          <Box key={item.title} component={Link} to={item.path} sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 2.5, color: "#16324f", textDecoration: "none", borderRight: { md: index < actions.length - 1 ? "1px solid #e7edf3" : 0 }, borderBottom: { xs: index < actions.length - 1 ? "1px solid #e7edf3" : 0, sm: index < 2 ? "1px solid #e7edf3" : 0, md: 0 }, transition: "background .2s ease, color .2s ease", "&:hover": { bgcolor: "#eef8f7", color: "#087f8c" } }}>
            <Box sx={{ flex: "0 0 auto", width: 46, height: 46, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "#e7f4f4", color: "#087f8c" }}>{item.icon}</Box>
            <Box><Typography fontWeight={900}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.text}</Typography></Box>
          </Box>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", maxWidth: 760, mx: "auto", mb: 5 }}>
          <Typography variant="overline" sx={{ color: "#087f8c", fontWeight: 900, letterSpacing: 2 }}>THERE IS A PLACE FOR YOU</Typography>
          <Typography variant="h2" component="h2" fontWeight={900} sx={{ mt: .75, fontSize: { xs: "2.2rem", md: "3.5rem" }, letterSpacing: "-.035em" }}>Come as you are. Grow with us.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: "1.08rem", lineHeight: 1.75 }}>Church is more than a Sunday service. It is a community where every generation can discover faith, friendship, and purpose.</Typography>
        </Box>
        <Grid container spacing={3}>
          {ministries.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "1px solid #e3eaf0", bgcolor: "rgba(255,255,255,.86)", transition: "transform .25s ease, box-shadow .25s ease", "&:hover": { transform: "translateY(-8px)", boxShadow: "0 22px 50px rgba(29,51,79,.13)" } }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ width: 64, height: 64, display: "grid", placeItems: "center", borderRadius: 3, color: item.color, bgcolor: item.wash, mb: 3 }}>{item.icon}</Box>
                  <Typography variant="overline" sx={{ color: item.color, fontWeight: 900, letterSpacing: 1.5 }}>{item.eyebrow}</Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: .5 }}>{item.title}</Typography>
                  <Typography color="text.secondary" sx={{ my: 1.75, lineHeight: 1.75, minHeight: { md: 84 } }}>{item.text}</Typography>
                  <Button component={Link} to={item.path} endIcon={<ArrowForwardIcon />} sx={{ px: 0, color: item.color, fontWeight: 850 }}>{item.action}</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="section" sx={{ mt: { xs: 8, md: 12 }, py: { xs: 6, md: 8 }, px: { xs: 3, md: 7 }, borderRadius: 5, position: "relative", overflow: "hidden", background: "linear-gradient(120deg, #14213d 0%, #155e75 65%, #087f8c 130%)", color: "common.white", "&::after": { content: '""', position: "absolute", width: 320, height: 320, borderRadius: "50%", right: -100, top: -160, bgcolor: "rgba(255,193,7,.16)" } }}>
        <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="overline" sx={{ color: "#ffd166", fontWeight: 900, letterSpacing: 2 }}>NEW HERE?</Typography>
            <Typography variant="h3" fontWeight={900} sx={{ mt: .5, fontSize: { xs: "2.1rem", md: "3.1rem" } }}>Your first step can be simple.</Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 690, color: "rgba(255,255,255,.78)", fontSize: "1.08rem", lineHeight: 1.7 }}>Visit on Sunday, introduce yourself, and let us help you feel at home. We would love to meet you and your family.</Typography>
          </Grid>
          <Grid item xs={12} md={4}><Stack spacing={1.5}><Button component={Link} to="/help" variant="contained" size="large" sx={{ bgcolor: "#ffbf47", color: "#17213a", fontWeight: 900, borderRadius: 99, "&:hover": { bgcolor: "#ffd166" } }}>I’m new here</Button><Button href={directionsUrl} target="_blank" rel="noopener noreferrer" color="inherit" startIcon={<LocationOnOutlinedIcon />}>Open in Google Maps</Button></Stack></Grid>
        </Grid>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
          <Box><Typography variant="overline" sx={{ color: "#087f8c", fontWeight: 900, letterSpacing: 2 }}>WHAT’S HAPPENING</Typography><Typography variant="h3" component="h2" fontWeight={900} sx={{ mt: .25, fontSize: { xs: "2.1rem", md: "3rem" }, letterSpacing: "-.03em" }}>Latest announcements</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>News, gatherings, and life in our church community.</Typography></Box>
          <Button component={Link} to="/program" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 850 }}>View church program</Button>
        </Stack>
        <AllPosts />
      </Container>
    </Box>
  );
};

export default Home;
