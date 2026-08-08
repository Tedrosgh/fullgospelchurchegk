import {
  MEZMURS_REQUEST,
  MEZMURS_SUCCESS,
  MEZMURS_FAILURE,
  MEZMUR_CREATE,
  MEZMUR_UPDATE,
  MEZMUR_DELETE,
} from "../constants/actionTypes";

const initialState = { items: [], loading: false, error: null };

const mezmurReducer = (state = initialState, action) => {
  switch (action.type) {
    case MEZMURS_REQUEST:
      return { ...state, loading: true, error: null };
    case MEZMURS_SUCCESS:
      return { items: action.payload, loading: false, error: null };
    case MEZMURS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case MEZMUR_CREATE:
      return { ...state, items: [...state.items, action.payload] };
    case MEZMUR_UPDATE:
      return {
        ...state,
        items: state.items.map((mezmur) =>
          mezmur._id === action.payload._id ? action.payload : mezmur
        ),
      };
    case MEZMUR_DELETE:
      return {
        ...state,
        items: state.items.filter((mezmur) => mezmur._id !== action.payload),
      };
    default:
      return state;
  }
};

export default mezmurReducer;
