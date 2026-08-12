import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import {
  createProfilePhoto,
  deleteProfilePhoto,
  fetchProfilePhotos,
  fetchSocialLinks,
  saveSocialLink,
  updateProfilePhoto,
  updateProfilePhotoOrder,
} from "../../api/api";

const emptyPhoto = { title: "", category: "Community", altText: "", imageUrl: "", displayOrder: 0, isVisible: true };
const platforms = ["facebook", "instagram", "youtube", "tiktok"];
const emptyLinks = Object.fromEntries(platforms.map((platform) => [platform, { url: "", isVisible: true }]));
const messageFrom = (error, fallback) => error.response?.data?.message || error.message || fallback;

const ProfileManagement = ({ tab = "gallery", canDelete = false }) => {
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(emptyPhoto);
  const [editingId, setEditingId] = useState(null);
  const [links, setLinks] = useState(emptyLinks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [photoResponse, linkResponse] = await Promise.all([fetchProfilePhotos(true), fetchSocialLinks()]);
      setPhotos(photoResponse.data);
      setLinks({ ...emptyLinks, ...linkResponse.data });
    } catch (error) {
      setFeedback({ severity: "error", message: messageFrom(error, "Profile content could not be loaded. Make sure the latest SQL has been applied.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
    reader.onload = () => setForm((current) => ({ ...current, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyPhoto, displayOrder: photos.length });
  };

  const submitPhoto = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.imageUrl) {
      setFeedback({ severity: "warning", message: "A title and image are required." });
      return;
    }
    setSaving(true);
    try {
      if (editingId) await updateProfilePhoto(editingId, form);
      else await createProfilePhoto({ ...form, displayOrder: photos.length });
      setFeedback({ severity: "success", message: editingId ? "Photo updated." : "Photo added to the Profile gallery." });
      resetForm();
      await load();
    } catch (error) {
      setFeedback({ severity: "error", message: messageFrom(error, "Photo could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  const editPhoto = (photo) => {
    setEditingId(photo.id);
    setForm(photo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePhoto = async (photo) => {
    if (!window.confirm(`Delete “${photo.title}” permanently?`)) return;
    try {
      await deleteProfilePhoto(photo.id);
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      setFeedback({ severity: "success", message: "Photo deleted." });
    } catch (error) {
      setFeedback({ severity: "error", message: messageFrom(error, "Photo could not be deleted.") });
    }
  };

  const movePhoto = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const ordered = [...photos];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setPhotos(ordered);
    try {
      await updateProfilePhotoOrder(ordered.map((photo) => photo.id));
      setFeedback({ severity: "success", message: "Gallery order updated." });
    } catch (error) {
      await load();
      setFeedback({ severity: "error", message: messageFrom(error, "Gallery order could not be updated.") });
    }
  };

  const saveLinks = async (event) => {
    event.preventDefault();
    const invalid = platforms.find((platform) => links[platform].url && !/^https?:\/\//i.test(links[platform].url));
    if (invalid) {
      setFeedback({ severity: "warning", message: `${invalid} must begin with http:// or https://.` });
      return;
    }
    setSaving(true);
    try {
      await Promise.all(platforms.filter((platform) => links[platform].url).map((platform) => saveSocialLink(platform, links[platform])));
      setFeedback({ severity: "success", message: "Social media links updated." });
    } catch (error) {
      setFeedback({ severity: "error", message: messageFrom(error, "Social links could not be saved.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ display: "grid", placeItems: "center", py: 8 }}><CircularProgress /></Box>;

  return <Box>
    <Paper sx={{ p: 3, mb: 3, borderRadius: 1, color: "white", background: "linear-gradient(120deg, #292a3e, #76565b)" }}>
      {tab === "social" ? <ShareOutlinedIcon sx={{ fontSize: 42 }} /> : <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 42 }} />}
      <Typography variant="h4" fontWeight={900} sx={{ mt: 1 }}>{tab === "social" ? "Social media" : "Profile gallery"}</Typography>
      <Typography sx={{ opacity: .8 }}>{tab === "social" ? "Maintain the church’s public Facebook, Instagram, YouTube, and TikTok links." : "Add, edit, arrange, hide, or remove the activity photos displayed on the Profile page."}</Typography>
    </Paper>
    {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ mb: 2 }}>{feedback.message}</Alert>}

    {tab === "social" ? (
      <Paper component="form" onSubmit={saveLinks} elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        <Grid container spacing={2.5}>
          {platforms.map((platform) => <Grid item xs={12} md={6} key={platform}>
            <TextField fullWidth label={`${platform.charAt(0).toUpperCase()}${platform.slice(1)} URL`} placeholder={`https://${platform}.com/...`} value={links[platform].url} onChange={(event) => setLinks((current) => ({ ...current, [platform]: { ...current[platform], url: event.target.value } }))} />
            <FormControlLabel control={<Checkbox checked={links[platform].isVisible} onChange={(event) => setLinks((current) => ({ ...current, [platform]: { ...current[platform], isVisible: event.target.checked } }))} />} label="Show on Profile page" />
          </Grid>)}
        </Grid>
        <Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={saving} sx={{ mt: 2 }}>{saving ? "Saving…" : "Save social links"}</Button>
      </Paper>
    ) : (
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} lg={4}>
          <Paper component="form" onSubmit={submitPhoto} elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 1, position: { lg: "sticky" }, top: { lg: 24 } }}>
            <Typography variant="h5" fontWeight={850}>{editingId ? "Edit photo" : "Add activity photo"}</Typography>
            <Stack spacing={2} sx={{ mt: 2.5 }}>
              <TextField required label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <TextField label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              <TextField label="Accessible description" helperText="Describe what is happening in the picture." multiline minRows={2} value={form.altText} onChange={(event) => setForm({ ...form, altText: event.target.value })} />
              <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />}>Choose picture<input hidden accept="image/*" type="file" onChange={chooseImage} /></Button>
              <TextField label="Or paste an image URL" value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." />
              {form.imageUrl && <Box component="img" src={form.imageUrl} alt="Selected preview" sx={{ width: "100%", height: 190, objectFit: "cover" }} />}
              <FormControlLabel control={<Checkbox checked={form.isVisible} onChange={(event) => setForm({ ...form, isVisible: event.target.checked })} />} label="Visible on Profile page" />
              <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving…" : editingId ? "Update photo" : "Add photo"}</Button>
              {editingId && <Button onClick={resetForm}>Cancel editing</Button>}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>
          {!photos.length ? <Alert severity="info">No managed photos yet. The Profile page will continue showing its built-in gallery until the first photo is added.</Alert> : <Grid container spacing={2}>{photos.map((photo, index) => <Grid item xs={12} sm={6} key={photo.id}>
            <Card elevation={0} sx={{ height: "100%", border: "1px solid", borderColor: "divider", opacity: photo.isVisible ? 1 : .58 }}>
              <CardMedia component="img" image={photo.imageUrl} alt={photo.altText || photo.title} sx={{ height: 190, objectFit: "cover" }} />
              <CardContent><Typography variant="overline" color="secondary">{photo.category}</Typography><Typography variant="h6" fontWeight={850}>{photo.title}</Typography><Typography variant="body2" color="text.secondary">{photo.isVisible ? "Visible" : "Hidden"}</Typography>
                <Stack direction="row" spacing={.5} sx={{ mt: 2 }}><Button size="small" onClick={() => editPhoto(photo)} startIcon={<EditOutlinedIcon />}>Edit</Button><Button size="small" disabled={index === 0} onClick={() => movePhoto(index, -1)} aria-label="Move photo up"><ArrowUpwardIcon /></Button><Button size="small" disabled={index === photos.length - 1} onClick={() => movePhoto(index, 1)} aria-label="Move photo down"><ArrowDownwardIcon /></Button>{canDelete && <Button size="small" color="error" onClick={() => removePhoto(photo)} aria-label="Delete photo"><DeleteOutlineIcon /></Button>}</Stack>
              </CardContent>
            </Card>
          </Grid>)}</Grid>}
        </Grid>
      </Grid>
    )}
  </Box>;
};

export default ProfileManagement;
