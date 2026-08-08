import * as api from "../api/api";
import {
  POSTS_REQUEST,
  POSTS_SUCCESS,
  POSTS_FAILURE,
  POST_CREATE,
  POST_UPDATE,
  POST_DELETE,
  MEZMURS_REQUEST,
  MEZMURS_SUCCESS,
  MEZMURS_FAILURE,
  MEZMUR_CREATE,
  MEZMUR_UPDATE,
  MEZMUR_DELETE,
} from "../constants/actionTypes";

const errorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong.";

export const getPosts = () => async (dispatch) => {
  dispatch({ type: POSTS_REQUEST });
  try {
    const { data } = await api.fetchPosts();
    dispatch({ type: POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POSTS_FAILURE, payload: errorMessage(error) });
  }
};

export const createPost = (post) => async (dispatch) => {
  const { data } = await api.createPost(post);
  dispatch({ type: POST_CREATE, payload: data });
  return data;
};

export const updatePost = (id, post) => async (dispatch) => {
  const { data } = await api.updatePost(id, post);
  dispatch({ type: POST_UPDATE, payload: data });
  return data;
};

export const deletePostAction = (id) => async (dispatch) => {
  await api.deletePost(id);
  dispatch({ type: POST_DELETE, payload: id });
};

export const likePostAction = (id) => async (dispatch) => {
  const { data } = await api.likePost(id);
  dispatch({ type: POST_UPDATE, payload: data });
};

export const getMezmurs = () => async (dispatch) => {
  dispatch({ type: MEZMURS_REQUEST });
  try {
    const { data } = await api.fetchMezmurs();
    dispatch({ type: MEZMURS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MEZMURS_FAILURE, payload: errorMessage(error) });
  }
};

export const addMezmur = (mezmur) => async (dispatch) => {
  const { data } = await api.createMezmur(mezmur);
  dispatch({ type: MEZMUR_CREATE, payload: data });
  return data;
};

export const updateMezmur = (id, mezmur) => async (dispatch) => {
  const { data } = await api.updateMezmur(id, mezmur);
  dispatch({ type: MEZMUR_UPDATE, payload: data });
  return data;
};

export const deleteMezmurAction = (id) => async (dispatch) => {
  await api.deleteMezmur(id);
  dispatch({ type: MEZMUR_DELETE, payload: id });
};
