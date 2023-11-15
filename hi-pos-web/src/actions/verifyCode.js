import {
  VALIDATE_CODE_SUCCESS,
  VALIDATE_CODE_FAIL,
  SENDCODE_SUCCESS,
  SENDCODE_FAIL,
  SET_MESSAGE,
  CLEAR_MESSAGE
} from "./types";

import VerifyCodeService from "../services/verifyCode.service";



export const sendcode = (values) => (dispatch) => {
  return VerifyCodeService.sendcode(values).then(
    (data) => {
      dispatch({ type: SENDCODE_SUCCESS, payload: true });
      dispatch({ type: CLEAR_MESSAGE });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({ type: SENDCODE_FAIL });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const validateCode = (values) => (dispatch) => {
  return VerifyCodeService.validate(values).then(
    (data) => {
      dispatch({ type: VALIDATE_CODE_SUCCESS, payload: true });
      dispatch({ type: CLEAR_MESSAGE });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({ type: VALIDATE_CODE_FAIL });
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject();
    }
  );
};