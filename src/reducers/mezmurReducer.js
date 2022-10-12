// import mezmursRouter from "../../../server/routes/mezmurs";
import {
    FETCH_ALL,
    FETCH_ONE,
    CREATE,
    UPDATE,
    DELETE,
    LIKE,
  } from "../constants/actionTypes";

  
  const mezmurReducer = (mezmurs = [], action) => {
    switch (action.type) {
      case FETCH_ALL:
        return action.payload;
      case CREATE:
        return [...mezmurs, action.payload];
      case FETCH_ONE:
        return mezmurs.map((mezmur)=>
        mezmur._id === action.payload._id ? action.payload : mezmur
        )
      case UPDATE:
        return mezmurs.map((mezmur) =>
          mezmur._id === action.payload._id ? action.payload : mezmur
        );
      case DELETE:
        return mezmurs.filter((mezmur) => mezmur._id !== action.payload);
      case LIKE:
        return mezmurs.map((mezmur) =>
          mezmur._id === action.payload._id ? action.payload : mezmur
        );
      default:
        return mezmurs;
    }
  };
  
  export default mezmurReducer;
  