import {
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  CLEAR_MESSAGE,
  SET_MESSAGE
  } from "./types";
  
  import UserService from "../services/user.service";

  export const forgotPassword = (values) => (dispatch) => {
    return UserService.forgotPassword(values).then(
      (data) => {
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: true});
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
  
        dispatch({ type: FORGOT_PASSWORD_FAIL});
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };