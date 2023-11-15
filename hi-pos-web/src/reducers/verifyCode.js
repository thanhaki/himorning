import {
  VALIDATE_CODE_FAIL,
  VALIDATE_CODE_SUCCESS,
} from "../actions/types";

const initialState = {isSuccess: false};


export default function verifyCodeAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case VALIDATE_CODE_FAIL:
      return {
        ...state,
        isSuccess: false,
      };
    case VALIDATE_CODE_SUCCESS:
      return {
        ...state,
        isSuccess: payload,
      };
    default:
      return state;
  }
}