import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
    HIDE_LOADING,
    SHOW_LOADING,
    CLEAR_MESSAGE,
  } from "./types";
  
  import AuthService from "../services/auth.service";

  export const login = (data) => (dispatch) => {
    dispatch({
      type: SHOW_LOADING,
      payload: true,
    });
    return AuthService.login(data).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
        dispatch({ type: HIDE_LOADING });
        dispatch({ type: CLEAR_MESSAGE });
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
  
        dispatch({ type: LOGIN_FAIL });
        dispatch({ type: HIDE_LOADING });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };

  export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
      type: LOGOUT,
    });
  };