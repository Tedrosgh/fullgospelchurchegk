import React from "react";
import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const MediaPage = ({ eyebrow, title, description, image, videos, accent = "#ffca28" }) => (
  <Box sx={{ py: { xs: 1, md: 3 }, pb: 7 }}>
    <Box sx={{ minHeight: { xs: 380, md: 480 }, borderRadius: 1, overflow: "hidden", display: "flex", alignItems: "flex-end", color: "common.white", backgroundImage: `linear-gradient(90deg, rgba(36,37,54,.9), rgba(63,53,65,.62) 58%, rgba(36,37,54,.25)), url(${image})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 24px 65px rgba(34,35,53,.2)" }}>
      <Box sx={{ p: { xs: 3, sm: 5, md: 6 }, maxWidth: 760 }}>
        <Chip label={eyebrow} sx={{ mb: 2, borderRadius: 0, bgcolor: "rgba(255,255,255,.14)", border: `1px solid ${accent}`, color: "white", fontWeight: 850, letterSpacing: 1 }} />
        <Typography component="h1" fontWeight={900} sx={{ fontSize: { xs: "2.8rem", md: "4.8rem" }, lineHeight: .95, textTransform: "uppercase" }}>{title}</Typography>
        <Typography variant="h6" sx={{ mt: 1.5, maxWidth: 650, color: "rgba(255,255,255,.86)", lineHeight: 1.55 }}>{description}</Typography>
      </Box>
    </Box>

    <Box sx={{ mt: { xs: 5, md: 7 } }}>
      <Typography variant="overline" color="secondary" fontWeight={850} letterSpacing={2}>Watch and grow</Typography>
      <Typography variant="h3" component="h2" fontWeight={850} sx={{ mb: 3, fontSize: { xs: "2rem", md: "2.8rem" } }}>Featured videos</Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} md={videos.length === 1 ? 12 : 6} key={video.url}>
            <Card elevation={0} sx={{ height: "100%", borderRadius: 1, overflow: "hidden", border: "1px solid", borderColor: "divider", borderTop: `4px solid ${accent}` }}>
              <Box sx={{ position: "relative", pt: "56.25%", bgcolor: "#0b1730" }}>
                <Box component="iframe" src={video.url} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}><PlayCircleOutlineIcon color="primary" /><Typography variant="h6" fontWeight={750}>{video.title}</Typography></Box>
                {video.subtitle && <Typography color="text.secondary" sx={{ mt: 1 }}>{video.subtitle}</Typography>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

export default MediaPage;
