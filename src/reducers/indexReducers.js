import { combineReducers } from "redux";
import postReducer from "./postReducer";
import mezmurReducer from "./mezmurReducer";
import auth from "./auth";

export default combineReducers({
  postReducer,
  mezmurReducer,
  auth,
});
