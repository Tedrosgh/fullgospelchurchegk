import axios from "axios";

const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL || "https://epmeeuihtaubxireizng.supabase.co";
const SUPABASE_KEY =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_ErlHhT1QWB2JLJ6taNjqaw_POT1vMBR";

const rest = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  timeout: 20000,
  headers: { apikey: SUPABASE_KEY },
});

const auth = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  timeout: 20000,
  headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
});

const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("profile"));
  } catch {
    localStorage.removeItem("profile");
    return null;
  }
};

rest.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${getProfile()?.token || SUPABASE_KEY}`;
  return request;
});

const mapPost = (post) => ({
  _id: post.id,
  title: post.title,
  message: post.message,
  tags: post.tags || [],
  selectedFile: post.selected_file || "",
  name: post.name,
  creator: post.creator,
  likes: post.likes || [],
  createdAt: post.created_at,
});

const postPayload = (post) => ({
  title: post.title,
  message: post.message || "",
  tags: Array.isArray(post.tags)
    ? post.tags.map((tag) => tag.trim()).filter(Boolean)
    : String(post.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
  selected_file: post.selectedFile || null,
  name: post.name || "",
  creator: getProfile()?.result?._id,
});

const mapMezmur = (mezmur) => ({
  _id: mezmur.id,
  title: mezmur.title,
  artist: mezmur.artist,
  langetext: mezmur.lyrics,
  name: mezmur.name,
  creator: mezmur.creator,
  createdAt: mezmur.created_at,
});

const mezmurPayload = (mezmur) => ({
  title: mezmur.title,
  artist: mezmur.artist || "",
  lyrics: mezmur.langetext,
  name: mezmur.name || "",
  creator: getProfile()?.result?._id,
});

const mappedResponse = (response, mapper) => ({
  ...response,
  data: Array.isArray(response.data)
    ? response.data.map(mapper)
    : mapper(response.data),
});

const firstMappedResponse = (response, mapper) => ({
  ...response,
  data: mapFirst(response.data, mapper),
});

const mapFirst = (records, mapper) =>
  records.length ? mapper(records[0]) : null;

export const fetchPosts = async () =>
  mappedResponse(await rest.get("/posts?select=*&order=created_at.desc"), mapPost);

export const createPost = async (post) =>
  firstMappedResponse(
    await rest.post("/posts", postPayload(post), {
      headers: { Prefer: "return=representation" },
    }),
    mapPost
  );

export const updatePost = async (id, post) =>
  firstMappedResponse(
    await rest.patch(`/posts?id=eq.${encodeURIComponent(id)}`, postPayload(post), {
      headers: { Prefer: "return=representation" },
    }),
    mapPost
  );

export const deletePost = (id) =>
  rest.delete(`/posts?id=eq.${encodeURIComponent(id)}`);

export const likePost = async (id) =>
  mappedResponse(await rest.post("/rpc/toggle_post_like", { post_id: id }), mapPost);

export const fetchMezmurs = async () =>
  mappedResponse(await rest.get("/mezmurs?select=*&order=title.asc"), mapMezmur);

export const fetchSingleMezmur = async (id) => {
  const response = await rest.get(`/mezmurs?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  if (!response.data.length) {
    const error = new Error("Song not found.");
    error.response = { data: { message: error.message } };
    throw error;
  }
  return { ...response, data: mapMezmur(response.data[0]) };
};

export const createMezmur = async (mezmur) =>
  firstMappedResponse(
    await rest.post("/mezmurs", mezmurPayload(mezmur), {
      headers: { Prefer: "return=representation" },
    }),
    mapMezmur
  );

export const updateMezmur = async (id, mezmur) =>
  firstMappedResponse(
    await rest.patch(`/mezmurs?id=eq.${encodeURIComponent(id)}`, mezmurPayload(mezmur), {
      headers: { Prefer: "return=representation" },
    }),
    mapMezmur
  );

export const deleteMezmur = (id) =>
  rest.delete(`/mezmurs?id=eq.${encodeURIComponent(id)}`);

const authData = (response) => {
  const user = response.data.user;
  const metadata = user.user_metadata || {};
  return {
    result: {
      _id: user.id,
      name: metadata.full_name || metadata.name || user.email,
      email: user.email,
    },
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    confirmationRequired: !response.data.access_token,
  };
};

export const signIn = async ({ email, password }) => {
  const response = await auth.post("/token?grant_type=password", { email, password });
  return { ...response, data: authData(response) };
};

export const signUp = async ({ firstName, lastName, email, password }) => {
  const response = await auth.post("/signup", {
    email,
    password,
    data: { full_name: `${firstName} ${lastName}`.trim() },
  });
  return { ...response, data: authData(response) };
};
