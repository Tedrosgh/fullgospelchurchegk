import { getYouTubeUrl } from "./youtube";

test.each([
  "https://www.youtube.com/watch?v=abc123",
  "https://youtu.be/abc123",
  "https://m.youtube.com/shorts/abc123",
  "https://music.youtube.com/watch?v=abc123",
])("accepts a YouTube link: %s", (url) => {
  expect(getYouTubeUrl(` ${url} `)).toBe(url);
});

test.each(["", undefined, "invalid", "javascript:alert(1)", "https://youtube.com.example.com/video", "https://example.com", "http://youtube.com/watch?v=abc", "https://user:password@youtube.com/watch?v=abc"])("rejects invalid or unsafe link: %s", (url) => {
  expect(getYouTubeUrl(url)).toBe("");
});
