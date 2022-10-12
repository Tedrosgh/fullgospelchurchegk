import * as api from "../api/api";
import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  FETCH_ONE,
} from "../constants/actionTypes";

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePostAction = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

export const likePostAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const getMezmurs = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPostsmezmur();
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const addMezmur = (mezmur) => async (dispatch) => {
  try {
    const { data } = await api.addnMezmur(mezmur);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const getSingleMezmur = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchSingleMezmur(id);
    dispatch({ type: FETCH_ONE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};


export const deleteMezmurAction = (id) => async (dispatch) => {
  try {
    await api.deleteMezmur(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMezmur = (id, mezmu) => async (dispatch) => {
  try {
    const { data } = await api.updatePostMezmur(id, mezmu);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
