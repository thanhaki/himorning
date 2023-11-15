import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    SET_MESSAGE,
    CLEAR_MESSAGE,
    SET_CURRENT_DON_VI
  } from "./types";  
  import DonViService from "../services/donvi.service.js";

  export const register = (values) => (dispatch) => {
    return DonViService.register(values).then(
      (data) => {
        dispatch({ type: REGISTER_SUCCESS, payload: true});
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
  
        dispatch({ type: REGISTER_FAIL});
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };

  export const setCurrentDonVi = (data) => ({
    type: SET_CURRENT_DON_VI,
    payload: data
  });