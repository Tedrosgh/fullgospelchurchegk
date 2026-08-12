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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import logo from "../../images/logo.jpg";
import { editorialGradient, editorialShadow } from "../../theme";

const programs = [
  {
    title: "Prayer & Fellowship",
    german: "Gebetsabend",
    schedule: "Every Sunday",
    time: "14:30 – 17:00",
    location: "At the church",
    icon: <GroupsOutlinedIcon fontSize="large" />,
    color: "#53536b",
  },
  {
    title: "Worship Service",
    german: "Gottesdienst",
    schedule: "1st and 3rd Saturday of each month",
    time: "From 15:30",
    location: "At the church",
    icon: <ChurchOutlinedIcon fontSize="large" />,
    color: "#76565b",
  },
  {
    title: "Bible Study",
    german: "Bibelstunde",
    schedule: "Every Thursday",
    time: "From 20:00",
    location: "Online via Zoom",
    icon: <AutoStoriesOutlinedIcon fontSize="large" />,
    color: "#087f8c",
  },
  {
    title: "Training & Teaching",
    german: "Weiterbildung",
    schedule: "Every Monday",
    time: "From 20:00",
    location: "By telephone",
    icon: <PhoneInTalkOutlinedIcon fontSize="large" />,
    color: "#b37b34",
  },
];

const Program = () => (
  <Box sx={{ minHeight: "100vh", py: { xs: 3, md: 6 } }}>
    <Container maxWidth="lg">
      <Paper
        elevation={4}
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          background: editorialGradient,
          boxShadow: editorialShadow,
          color: "common.white",
          mb: 4,
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ p: { xs: 3, sm: 5, md: 6 } }}>
              <Chip label="You are welcome" sx={{ mb: 2, bgcolor: "rgba(255,255,255,.16)", color: "white" }} />
              <Typography component="h1" variant="h3" fontWeight={800} sx={{ fontSize: { xs: "2.15rem", md: "3rem" } }}>
                Weekly Church Program
              </Typography>
              <Typography variant="h6" sx={{ mt: 1.5, opacity: 0.9, maxWidth: 680 }}>
                Eritrean Full Gospel Church Cologne
              </Typography>
              <Typography lang="ti" sx={{ mt: 2, fontSize: "1.1rem", opacity: 0.9 }}>
                ኩሉ ጊዜ ሰንበት ካብ ሰዓት 14፡30 ክሳብ 17፡00
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<LocationOnOutlinedIcon />}
                  href="https://www.google.com/maps/search/?api=1&query=Im+Weidenbruch+4%2C+51061+K%C3%B6ln"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </Button>
                <Button variant="outlined" color="inherit" startIcon={<CallOutlinedIcon />} href="tel:+4915208594919">
                  Call us
                </Button>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
              <Box component="img" src={logo} alt="Church logo" sx={{ width: "100%", maxWidth: 280, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%", border: "8px solid rgba(255,255,255,.2)" }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" component="h2" fontWeight={800}>Join us during the week</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Prayer, worship, Bible study, and spiritual growth for the whole community.</Typography>
      </Box>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} key={program.title}>
            <Card elevation={0} sx={{ height: "100%", borderRadius: 1, border: "1px solid", borderColor: "divider", borderTop: `4px solid ${program.color}`, transition: "transform .2s ease, box-shadow .2s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: editorialShadow } }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ bgcolor: `${program.color}18`, color: program.color, borderRadius: 2, p: 1.5, display: "flex" }}>{program.icon}</Box>
                  <Box>
                    <Typography variant="h5" fontWeight={750}>{program.title}</Typography>
                    <Typography color="text.secondary">{program.german}</Typography>
                  </Box>
                </Stack>
                <Stack spacing={1.25} sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center"><CalendarMonthOutlinedIcon color="action" /><Typography fontWeight={600}>{program.schedule}</Typography></Stack>
                  <Stack direction="row" spacing={1.25} alignItems="center"><AccessTimeIcon color="action" /><Typography>{program.time}</Typography></Stack>
                  <Stack direction="row" spacing={1.25} alignItems="center"><LocationOnOutlinedIcon color="action" /><Typography>{program.location}</Typography></Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ mt: 4, p: { xs: 3, md: 4 }, borderRadius: 1, border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight={800}>Visit or contact us</Typography>
            <Typography sx={{ mt: 1 }}>Im Weidenbruch 4, 51061 Köln, Germany</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Contact: Pastor Abraham Z. Teweldemedhin</Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={1.5} alignItems={{ md: "flex-start" }}>
              <Button startIcon={<CallOutlinedIcon />} href="tel:+4915208594919">+49 1520 8594919</Button>
              <Button startIcon={<EmailOutlinedIcon />} href="mailto:abrahamzth@yahoo.de">abrahamzth@yahoo.de</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  </Box>
);

export default Program;
