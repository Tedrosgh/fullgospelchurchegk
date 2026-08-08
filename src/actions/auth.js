import { AUTH } from "../constants/actionTypes";
import * as api from "../api/api";

const authenticate = (request, formData) => async (dispatch) => {
  try {
    const { data } = await request(formData);
    dispatch({ type: AUTH, data });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error.response?.data?.message ||
        "Authentication failed. Please check your details and try again.",
    };
  }
};

export const signin = (formData) => authenticate(api.signIn, formData);
export const signup = (formData) => authenticate(api.signUp, formData);
