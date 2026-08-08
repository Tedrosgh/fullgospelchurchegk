import { AUTH } from "../constants/actionTypes";
import * as api from "../api/api";

const authenticate = (request, formData) => async (dispatch) => {
  try {
    const { data } = await request(formData);
    if (data.confirmationRequired) {
      return {
        ok: true,
        confirmationRequired: true,
        message: "Account created. Check your email to confirm your account before signing in.",
      };
    }
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
