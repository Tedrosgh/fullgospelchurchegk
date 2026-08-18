import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { fetchHomePageContent, saveHomePageContent } from "../../api/api";
import defaultHeroImage from "../../images/pasAbr.jpg";

const defaults = {
  eyebrow: "WELCOME TO",
  titleLineOne: "Eritrean Full Gospel",
  titleLineTwo: "Church Cologne",
  description: "A welcoming community growing together through worship, God’s Word, prayer, and everyday life.",
  heroImageUrl: defaultHeroImage,
};

const messageFrom = (error, fallback) => error.response?.data?.message || error.message || fallback;

const HomePageManagement = () => {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchHomePageContent()
      .then(({ data }) => {
        if (data) setForm({ ...defaults, ...data });
      })
      .catch((error) => setFeedback({ severity: "error", message: messageFrom(error, "Home-page content could not be loaded. Apply the latest schema.sql first.") }))
      .finally(() => setLoading(false));
  }, []);

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback({ severity: "error", message: "Choose an image file." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ severity: "error", message: "Please use an image smaller than 2 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, heroImageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.eyebrow.trim() || !form.titleLineOne.trim() || !form.heroImageUrl) {
      setFeedback({ severity: "warning", message: "Welcome text, first title line, and a photo are required." });
      return;
    }
    setSaving(true);
    try {
      const { data } = await saveHomePageContent(form);
      setForm({ ...defaults, ...data });
      setFeedback({ severity: "success", message: "Home-page photo and writing updated." });
    } catch (error) {
      setFeedback({ severity: "error", message: messageFrom(error, "Home-page content could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  return <Box>
    <Paper sx={{ p: 3, mb: 3, borderRadius: 1, color: "white", background: "linear-gradient(120deg, #292a3e, #155e75)" }}>
      <HomeOutlinedIcon sx={{ fontSize: 42 }} />
      <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>Home page</Typography>
      <Typography sx={{ opacity: .8 }}>Change the hero photo and the writing visitors see first.</Typography>
    </Paper>
    {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ mb: 2 }}>{feedback.message}</Alert>}
    <Grid component="form" onSubmit={save} container spacing={3} alignItems="flex-start">
      <Grid item xs={12} lg={5}>
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Stack spacing={2}>
            <TextField required label="Small welcome text" value={form.eyebrow} inputProps={{ maxLength: 80 }} onChange={(event) => setForm({ ...form, eyebrow: event.target.value })} />
            <TextField required label="Title — first line" value={form.titleLineOne} inputProps={{ maxLength: 120 }} onChange={(event) => setForm({ ...form, titleLineOne: event.target.value })} />
            <TextField label="Title — second line" value={form.titleLineTwo} inputProps={{ maxLength: 120 }} onChange={(event) => setForm({ ...form, titleLineTwo: event.target.value })} />
            <TextField label="Introductory paragraph" multiline minRows={3} value={form.description} inputProps={{ maxLength: 500 }} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />}>Choose hero photo<input hidden accept="image/*" type="file" onChange={chooseImage} /></Button>
            <TextField label="Or paste an image URL" value={form.heroImageUrl.startsWith("data:") || form.heroImageUrl === defaultHeroImage ? "" : form.heroImageUrl} onChange={(event) => setForm({ ...form, heroImageUrl: event.target.value })} placeholder="https://..." />
            <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={saving}>{saving ? "Saving…" : "Save home page"}</Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Paper sx={{ position: "relative", minHeight: 430, overflow: "hidden", borderRadius: 1, color: "white", backgroundImage: `linear-gradient(rgba(25,25,42,.48), rgba(20,24,39,.72)), url(${form.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center", display: "grid", placeItems: "center", textAlign: "center", p: 4 }}>
          <Box><Typography variant="overline" fontWeight={800}>{form.eyebrow}</Typography><Typography variant="h3" fontWeight={900} sx={{ textTransform: "uppercase", mt: 1 }}>{form.titleLineOne}{form.titleLineTwo && <Box component="span" sx={{ display: "block" }}>{form.titleLineTwo}</Box>}</Typography><Typography sx={{ mt: 2, opacity: .85 }}>{form.description}</Typography></Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Preview of the public hero section.</Typography>
      </Grid>
    </Grid>
  </Box>;
};

export default HomePageManagement;
