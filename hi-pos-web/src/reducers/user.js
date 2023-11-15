import {
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from "../actions/types";

const initialState = {isSuccess: false};


export default function userAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        isSuccess: false,
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        isSuccess: payload,
      };
    default:
      return state;
  }
}