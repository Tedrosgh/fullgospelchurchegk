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

const functions = axios.create({
  baseURL: `${SUPABASE_URL}/functions/v1`,
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
  displayOrder: post.display_order || 0,
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
  display_order: Number(post.displayOrder) || 0,
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
  mappedResponse(await rest.get("/posts?select=*&order=display_order.asc,created_at.desc"), mapPost);

export const updateAnnouncementOrder = (orderedIds) =>
  Promise.all(orderedIds.map((id, index) => rest.patch(`/posts?id=eq.${encodeURIComponent(id)}`, { display_order: index })));

export const fetchSinglePost = async (id) => {
  const response = await rest.get(`/posts?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  if (!response.data.length) {
    const error = new Error("Card not found.");
    error.response = { data: { message: error.message } };
    throw error;
  }
  return { ...response, data: mapPost(response.data[0]) };
};

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

const mapFinanceEntry = (entry) => ({
  id: entry.id,
  weekStart: entry.week_start,
  type: entry.entry_type,
  category: entry.category,
  description: entry.description,
  amount: Number(entry.amount),
  createdAt: entry.created_at,
});

const financePayload = (entry, includeRecorder = true) => ({
  week_start: entry.weekStart,
  entry_type: entry.type,
  category: entry.category.trim(),
  description: entry.description.trim(),
  amount: Number(entry.amount),
  ...(includeRecorder ? { recorded_by: getProfile()?.result?._id } : {}),
});

export const checkFinanceAdmin = async () => {
  const response = await rest.post("/rpc/is_church_admin", {});
  return { ...response, data: Boolean(response.data) };
};

export const checkPortalAdmin = async () => {
  const response = await rest.post("/rpc/is_portal_admin", {});
  return { ...response, data: Boolean(response.data) };
};

export const fetchMyPortalAccess = async () => {
  const response = await rest.post("/rpc/get_my_portal_access", {});
  return { ...response, data: response.data || { isAdmin: false, teams: {} } };
};

const adminUserRequest = (method, data) =>
  functions.request({
    url: "/admin-users",
    method,
    data,
    headers: { Authorization: `Bearer ${getProfile()?.token}` },
  });

export const fetchAdminUsers = () => adminUserRequest("get");
export const createAdminUser = (user) => adminUserRequest("post", user);
export const updateAdminUserAccess = (user) => adminUserRequest("patch", user);

const mapProfilePhoto = (photo) => ({
  id: photo.id,
  title: photo.title,
  category: photo.category,
  altText: photo.alt_text || "",
  imageUrl: photo.image_url,
  displayOrder: photo.display_order || 0,
  isVisible: photo.is_visible,
});

const profilePhotoPayload = (photo, includeCreator = true) => ({
  title: photo.title.trim(),
  category: photo.category.trim() || "Community",
  alt_text: photo.altText.trim(),
  image_url: photo.imageUrl,
  display_order: Number(photo.displayOrder) || 0,
  is_visible: Boolean(photo.isVisible),
  ...(includeCreator ? { created_by: getProfile()?.result?._id } : {}),
});

export const fetchProfilePhotos = async (includeHidden = false) =>
  mappedResponse(
    await rest.get(`/profile_photos?select=*${includeHidden ? "" : "&is_visible=eq.true"}&order=display_order.asc,created_at.desc`),
    mapProfilePhoto
  );

export const createProfilePhoto = async (photo) =>
  firstMappedResponse(
    await rest.post("/profile_photos", profilePhotoPayload(photo), { headers: { Prefer: "return=representation" } }),
    mapProfilePhoto
  );

export const updateProfilePhoto = async (id, photo) =>
  firstMappedResponse(
    await rest.patch(`/profile_photos?id=eq.${encodeURIComponent(id)}`, profilePhotoPayload(photo, false), { headers: { Prefer: "return=representation" } }),
    mapProfilePhoto
  );

export const deleteProfilePhoto = (id) =>
  rest.delete(`/profile_photos?id=eq.${encodeURIComponent(id)}`);

export const updateProfilePhotoOrder = (orderedIds) =>
  Promise.all(orderedIds.map((id, index) => rest.patch(`/profile_photos?id=eq.${encodeURIComponent(id)}`, { display_order: index })));

export const fetchSocialLinks = async () => {
  const response = await rest.get("/social_links?select=*&order=platform.asc");
  return {
    ...response,
    data: Object.fromEntries(response.data.map((link) => [link.platform, { url: link.url, isVisible: link.is_visible }])),
  };
};

export const saveSocialLink = (platform, link) =>
  rest.post(
    `/social_links?on_conflict=platform`,
    { platform, url: link.url.trim(), is_visible: Boolean(link.isVisible), updated_by: getProfile()?.result?._id, updated_at: new Date().toISOString() },
    { headers: { Prefer: "resolution=merge-duplicates,return=representation" } }
  );

export const fetchFinanceEntries = async () =>
  mappedResponse(
    await rest.get("/finance_entries?select=*&order=week_start.desc,created_at.desc"),
    mapFinanceEntry
  );

export const createFinanceEntry = async (entry) =>
  firstMappedResponse(
    await rest.post("/finance_entries", financePayload(entry), {
      headers: { Prefer: "return=representation" },
    }),
    mapFinanceEntry
  );

export const updateFinanceEntry = async (id, entry) =>
  firstMappedResponse(
    await rest.patch(`/finance_entries?id=eq.${encodeURIComponent(id)}`, financePayload(entry, false), {
      headers: { Prefer: "return=representation" },
    }),
    mapFinanceEntry
  );

export const deleteFinanceEntry = (id) =>
  rest.delete(`/finance_entries?id=eq.${encodeURIComponent(id)}`);

const mapFinanceDocument = (document) => ({
  id: document.id,
  type: document.document_type,
  title: document.title,
  documentDate: document.document_date,
  fileUrl: document.file_url || "",
  notes: document.notes,
  createdAt: document.created_at,
});

const financeDocumentPayload = (document, includeUploader = true) => ({
  document_type: document.type,
  title: document.title.trim(),
  document_date: document.documentDate,
  file_url: document.fileUrl.trim() || null,
  notes: document.notes.trim(),
  ...(includeUploader ? { uploaded_by: getProfile()?.result?._id } : {}),
});

export const fetchFinanceDocuments = async () =>
  mappedResponse(
    await rest.get("/finance_documents?select=*&order=document_date.desc,created_at.desc"),
    mapFinanceDocument
  );

export const createFinanceDocument = async (document) =>
  firstMappedResponse(
    await rest.post("/finance_documents", financeDocumentPayload(document), {
      headers: { Prefer: "return=representation" },
    }),
    mapFinanceDocument
  );

export const updateFinanceDocument = async (id, document) =>
  firstMappedResponse(
    await rest.patch(
      `/finance_documents?id=eq.${encodeURIComponent(id)}`,
      financeDocumentPayload(document, false),
      { headers: { Prefer: "return=representation" } }
    ),
    mapFinanceDocument
  );

export const deleteFinanceDocument = (id) =>
  rest.delete(`/finance_documents?id=eq.${encodeURIComponent(id)}`);

const authData = (response) => {
  // Password sign-in returns a session containing `user`, while an email-
  // confirmation signup can return the user directly with no session yet.
  const user = response.data.user || response.data;
  const metadata = user.user_metadata || {};
  const accessToken = response.data.access_token || response.data.session?.access_token;
  const refreshToken = response.data.refresh_token || response.data.session?.refresh_token;
  return {
    result: {
      _id: user.id,
      name: metadata.full_name || metadata.name || user.email,
      email: user.email,
    },
    token: accessToken,
    refreshToken,
    confirmationRequired: !accessToken,
  };
};

export const refreshSession = async (refreshToken) => {
  const response = await auth.post("/token?grant_type=refresh_token", {
    refresh_token: refreshToken,
  });
  return { ...response, data: authData(response) };
};

export const signOut = (accessToken) =>
  auth.post("/logout", {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const requestPasswordReset = (email) =>
  auth.post(`/recover?redirect_to=${encodeURIComponent(`${window.location.origin}/auth`)}`, { email });

export const resendConfirmation = (email) =>
  auth.post(`/resend?redirect_to=${encodeURIComponent(`${window.location.origin}/auth`)}`, {
    type: "signup",
    email: email.trim().toLowerCase(),
  });

export const completeAuthRedirect = async (accessToken, refreshToken) => {
  const userResponse = await auth.get("/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    ...userResponse,
    data: authData({
      data: {
        user: userResponse.data,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    }),
  };
};

export const updatePassword = (accessToken, password) =>
  auth.put("/user", { password }, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const signIn = async ({ email, password }) => {
  const response = await auth.post("/token?grant_type=password", { email, password });
  return { ...response, data: authData(response) };
};

export const signUp = async (formData) => {
  const firstName = String(formData.firstName || "").trim();
  const lastName = String(formData.lastName || "").trim();
  const email = String(formData.email || "").trim().toLowerCase();
  const password = String(formData.password || "");

  if (!email || !password) {
    const error = new Error("Email and password are required to create an account.");
    error.response = { data: { message: error.message } };
    throw error;
  }

  const response = await auth.post(
    `/signup?redirect_to=${encodeURIComponent(`${window.location.origin}/auth`)}`,
    {
      email,
      password,
      data: { full_name: `${firstName} ${lastName}`.trim() },
    }
  );
  return { ...response, data: authData(response) };
};
