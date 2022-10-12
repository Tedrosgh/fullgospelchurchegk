import axios from "axios";

//const url = "http://localhost:5000/posts";

const API = axios?.create({ baseURL: "https://nameless-hollows-61846.herokuapp.com" });
//const APIM = axios.create({ baseURL: "http://localhost:8000"});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const fetchPosts = () => API.get("/posts");
export const fetchPostsmezmur = () => API.get("/mezmur");

export const createPost = (newPost) => API.post("/posts", newPost);
export const addnMezmur = (newMezmur) => API.post("/mezmur", newMezmur);

export const fetchSingleMezmur = (id) => API.get(`/mezmur/${id}`);

export const updatePost = (id, updatePost) =>
  API.patch(`/posts/${id}`, updatePost);
export const updatePostMezmur = (id, updateMezmur) =>
  API.patch(`/mezmur/${id}`, updateMezmur);

export const deletePost = (id) => API.delete(`/posts/${id}`);
export const deleteMezmur = (id) => API.delete(`/mezmur/${id}`);


export const likePost = (id) => API.patch(`/posts/${id}/likepost`);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
