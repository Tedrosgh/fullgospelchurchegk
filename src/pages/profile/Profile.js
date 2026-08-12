import React from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import { Link } from "react-router-dom";
import worshipImage from "../../images/mezemran.jpg";
import choirImage from "../../images/mezmur1.jpg";
import youthImage from "../../images/medrek.jpg";
import childrenImage from "../../images/hixanat.jpg";
import pastorImage from "../../images/pasAbr.jpg";

const activities = [
  { title: "Worship together", label: "Worship", image: worshipImage, size: { xs: 12, md: 8 }, height: { xs: 300, md: 520 } },
  { title: "Songs of faith", label: "Mezmur", image: choirImage, size: { xs: 12, md: 4 }, height: { xs: 300, md: 520 } },
  { title: "Growing in fellowship", label: "Youth", image: youthImage, size: { xs: 12, md: 5 }, height: { xs: 300, md: 390 } },
  { title: "Faith for every generation", label: "Children", image: childrenImage, size: { xs: 12, md: 7 }, height: { xs: 300, md: 390 } },
];

const values = [
  { title: "Worship", text: "We gather to honour God through prayer, music, and joyful praise.", icon: <MusicNoteOutlinedIcon /> },
  { title: "God’s Word", text: "Biblical teaching helps us grow in faith and live with purpose.", icon: <AutoStoriesOutlinedIcon /> },
  { title: "Community", text: "We share life across generations and make room for every person.", icon: <GroupsOutlinedIcon /> },
  { title: "Service", text: "We use our gifts to care for one another and serve our neighbours.", icon: <VolunteerActivismOutlinedIcon /> },
];

const Profile = () => (
  <Box sx={{ pb: { xs: 7, md: 10 } }}>
    <Box
      component="section"
      sx={{
        minHeight: { xs: 500, md: 620 },
        borderRadius: 1,
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 7,
        textAlign: "center",
        color: "common.white",
        backgroundImage: `linear-gradient(180deg, rgba(38,39,57,.4), rgba(35,31,45,.74)), url(${pastorImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 24px 65px rgba(34,35,53,.2)",
      }}
    >
      <Box sx={{ maxWidth: 880 }}>
        <Typography variant="overline" sx={{ letterSpacing: { xs: 3, md: 6 }, color: "rgba(255,255,255,.84)" }}>WHO WE ARE</Typography>
        <Typography component="h1" fontWeight={900} sx={{ mt: 1.5, fontSize: { xs: "3rem", sm: "4.5rem", md: "6rem" }, lineHeight: .94, textTransform: "uppercase" }}>Faith lived together</Typography>
        <Typography sx={{ maxWidth: 700, mx: "auto", mt: 3, fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.75, color: "rgba(255,255,255,.84)" }}>
          We are an Eritrean church family in Cologne—worshipping, learning, celebrating, and serving side by side.
        </Typography>
        <Button component={Link} to="/program" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ mt: 3.5, borderRadius: 0, bgcolor: "white", color: "#292a3e", px: 3.5, "&:hover": { bgcolor: "#f3eee9" } }}>Join our next gathering</Button>
      </Box>
    </Box>

    <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        <Grid item xs={12} md={5}>
          <Typography variant="overline" color="secondary">OUR CHURCH FAMILY</Typography>
          <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: "2.4rem", md: "3.6rem" }, lineHeight: 1.05 }}>More than a Sunday service.</Typography>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography color="text.secondary" sx={{ fontSize: { xs: "1.05rem", md: "1.18rem" }, lineHeight: 1.85 }}>
            Church life happens wherever people pray together, encourage one another, learn from Scripture, and offer their gifts. Our congregation brings children, young people, families, and friends together in a community shaped by faith, Eritrean heritage, and hope in Jesus Christ.
          </Typography>
        </Grid>
      </Grid>
    </Box>

    <Box component="section" aria-labelledby="activity-gallery-title">
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={2} sx={{ mb: 3 }}>
        <Box><Typography variant="overline" color="secondary">LIFE TOGETHER</Typography><Typography id="activity-gallery-title" variant="h3" sx={{ mt: .5 }}>Our congregation in action</Typography></Box>
        <Button href="https://www.facebook.com/eriwongel" target="_blank" rel="noopener noreferrer" startIcon={<FacebookIcon />} endIcon={<ArrowForwardIcon />}>Follow on Facebook</Button>
      </Stack>
      <Grid container spacing={2}>
        {activities.map((activity) => (
          <Grid item xs={activity.size.xs} md={activity.size.md} key={activity.title}>
            <Box sx={{ height: activity.height, position: "relative", overflow: "hidden", bgcolor: "#292a3e", "& img": { transition: "transform .7s ease" }, "&:hover img": { transform: "scale(1.045)" } }}>
              <Box component="img" src={activity.image} alt={activity.title} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", p: { xs: 2.5, md: 3.5 }, color: "white", background: "linear-gradient(180deg, transparent 42%, rgba(25,25,38,.82))" }}>
                <Typography variant="overline" sx={{ opacity: .78 }}>{activity.label}</Typography>
                <Typography variant="h5" fontWeight={850}>{activity.title}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
      <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 5 }}><Typography variant="overline" color="secondary">WHAT SHAPES US</Typography><Typography variant="h3" sx={{ mt: .75 }}>Growing in faith and love</Typography></Box>
      <Grid container spacing={2}>
        {values.map((value) => (
          <Grid item xs={12} sm={6} md={3} key={value.title}>
            <Box sx={{ height: "100%", p: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", color: "secondary.main", border: "1px solid", borderColor: "secondary.main", mb: 2.5 }}>{value.icon}</Box>
              <Typography variant="h6" fontWeight={850}>{value.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>{value.text}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ p: { xs: 4, md: 7 }, textAlign: "center", color: "white", background: "linear-gradient(125deg, #292a3e, #41394a 62%, #76565b)" }}>
      <ChurchOutlinedIcon sx={{ fontSize: 44, color: "#ffd166" }} />
      <Typography variant="h3" sx={{ mt: 1 }}>There is a place for you here.</Typography>
      <Typography sx={{ mt: 1.5, mx: "auto", maxWidth: 650, color: "rgba(255,255,255,.76)" }}>Come worship with us, meet the congregation, and discover the life of our church community.</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={1.5} sx={{ mt: 3 }}><Button component={Link} to="/program" variant="contained" color="warning">Plan your visit</Button><Button component={Link} to="/help" variant="outlined" color="inherit">Contact us</Button></Stack>
    </Box>
  </Box>
);

export default Profile;
