import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://server-full-gospel.onrender.com",
  timeout: 20000,
});

API.interceptors.request.use((request) => {
  try {
    const token = JSON.parse(localStorage.getItem("profile"))?.token;
    if (token) request.headers.Authorization = `Bearer ${token}`;
  } catch {
    localStorage.removeItem("profile");
  }
  return request;
});

export const fetchPosts = () => API.get("/posts");
export const createPost = (post) => API.post("/posts", post);
export const updatePost = (id, post) => API.patch(`/posts/${id}`, post);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likepost`);

export const fetchMezmurs = () => API.get("/mezmur");
export const fetchSingleMezmur = (id) => API.get(`/mezmur/${id}`);
export const createMezmur = (mezmur) => API.post("/mezmur", mezmur);
export const updateMezmur = (id, mezmur) => API.patch(`/mezmur/${id}`, mezmur);
export const deleteMezmur = (id) => API.delete(`/mezmur/${id}`);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
