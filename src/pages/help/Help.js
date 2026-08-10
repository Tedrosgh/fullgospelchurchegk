import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "How do I create and confirm my account?",
    answer:
      "Open Sign In, choose Create account, and submit your details. Check your inbox and spam folder for the confirmation email. After confirming, return to the website and sign in.",
  },
  {
    question: "Why does Supabase say the email rate limit was exceeded?",
    answer:
      "Only a small number of confirmation emails can be sent within an hour using the default email service. Wait before trying again and avoid repeatedly selecting Sign Up or Resend confirmation email.",
  },
  {
    question: "Who can modify or delete posts and Mezmur entries?",
    answer:
      "You must be signed in, and only the person who created an item can modify or delete it. Everyone can view public content.",
  },
  {
    question: "Who can access church finance records?",
    answer:
      "Income, expenses, reports, and finance documents are restricted to designated church administrators. Public visitors can only see the church donation bank details.",
  },
  {
    question: "How can I find the weekly church schedule?",
    answer:
      "Open the Program page to see prayer meetings, worship services, Bible study, telephone teaching, directions, and church contact information.",
  },
];

const Help = () => (
  <Box sx={{ minHeight: "100vh", py: { xs: 3, md: 6 } }}>
    <Container maxWidth="lg">
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          mb: 4,
          borderRadius: 4,
          color: "common.white",
          background: "linear-gradient(135deg, #4527a0 0%, #1565c0 60%, #00838f 100%)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
          <Box sx={{ width: 76, height: 76, borderRadius: "50%", bgcolor: "rgba(255,255,255,.16)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <HelpOutlineIcon sx={{ fontSize: 44 }} />
          </Box>
          <Box>
            <Typography component="h1" variant="h3" fontWeight={800}>How can we help?</Typography>
            <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
              Find answers, church information, and technical support for this website.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%", borderRadius: 3, borderTop: "5px solid #1565c0" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <ChurchOutlinedIcon color="primary" fontSize="large" />
                <Box><Typography variant="h5" fontWeight={750}>Church assistance</Typography><Typography color="text.secondary">Programs, ministry, prayer, and visits</Typography></Box>
              </Stack>
              <Typography fontWeight={650}>Pastor Abraham Z. Teweldemedhin</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>Im Weidenbruch 4, 51061 Köln</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 3 }}>
                <Button variant="contained" startIcon={<CallOutlinedIcon />} href="tel:+4915208594919">Call pastor</Button>
                <Button variant="outlined" startIcon={<EmailOutlinedIcon />} href="mailto:abrahamzth@yahoo.de">Send email</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%", borderRadius: 3, borderTop: "5px solid #7b1fa2" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <SupportAgentOutlinedIcon sx={{ color: "#7b1fa2" }} fontSize="large" />
                <Box><Typography variant="h5" fontWeight={750}>Website support</Typography><Typography color="text.secondary">Errors, account issues, comments, or suggestions</Typography></Box>
              </Stack>
              <Typography fontWeight={650}>Developer: Tedros Ghebremichael</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>Please describe the page and error you encountered.</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 3 }}>
                <Button variant="contained" color="secondary" startIcon={<CallOutlinedIcon />} href="tel:+4915786771856">Call support</Button>
                <Button variant="outlined" color="secondary" startIcon={<EmailOutlinedIcon />} href="mailto:tedrosgh@yahoo.com?subject=Church%20website%20support">Email support</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h2" fontWeight={800} gutterBottom>Frequently asked questions</Typography>
          <Stack spacing={1.5}>
            {questions.map(({ question, answer }) => (
              <Accordion key={question} disableGutters elevation={2} sx={{ borderRadius: "12px !important", overflow: "hidden", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={700}>{question}</Typography>
                </AccordionSummary>
                <AccordionDetails><Typography color="text.secondary">{answer}</Typography></AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={750}>Quick links</Typography>
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              <Button component={Link} to="/auth" variant="outlined" startIcon={<LoginOutlinedIcon />} endIcon={<ArrowForwardIcon />}>Sign in or create account</Button>
              <Button component={Link} to="/program" variant="outlined" startIcon={<ChurchOutlinedIcon />} endIcon={<ArrowForwardIcon />}>View church program</Button>
              <Button component={Link} to="/mezmur" variant="outlined" startIcon={<MusicNoteOutlinedIcon />} endIcon={<ArrowForwardIcon />}>Browse Mezmur</Button>
            </Stack>
            <Alert severity="info" sx={{ mt: 3 }}>
              Never send passwords, bank credentials, or Supabase secret keys by email.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Help;
