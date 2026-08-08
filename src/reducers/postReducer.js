import {
  POSTS_REQUEST,
  POSTS_SUCCESS,
  POSTS_FAILURE,
  POST_CREATE,
  POST_UPDATE,
  POST_DELETE,
} from "../constants/actionTypes";

const initialState = { items: [], loading: false, error: null };

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POSTS_REQUEST:
      return { ...state, loading: true, error: null };
    case POSTS_SUCCESS:
      return { items: action.payload, loading: false, error: null };
    case POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case POST_CREATE:
      return { ...state, items: [action.payload, ...state.items] };
    case POST_UPDATE:
      return {
        ...state,
        items: state.items.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case POST_DELETE:
      return {
        ...state,
        items: state.items.filter((post) => post._id !== action.payload),
      };
    default:
      return state;
  }
};

export default postReducer;
