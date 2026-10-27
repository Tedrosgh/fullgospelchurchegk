// Accept YouTube links only; also guard links loaded from stored song data.
export const getYouTubeUrl = (value) => {
  try {
    const url = new URL(String(value || "").trim());
    const hosts = ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtu.be"];
    if (url.protocol !== "https:" || !hosts.includes(url.hostname) || url.username || url.password || url.port) return "";
    return url.href;
  } catch {
    return "";
  }
};
