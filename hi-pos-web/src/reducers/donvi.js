import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,SET_CURRENT_DON_VI
} from "../actions/types";

const initialState = {isSuccess: false};


export default function donviAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_FAIL:
      return {
        ...state,
        isSuccess: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isSuccess: payload,
      };
      case SET_CURRENT_DON_VI:
        return {
          ...state,
          currentDV: payload,
        };
    default:
      return state;
  }
}