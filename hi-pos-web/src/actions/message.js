import { SET_MESSAGE,LOAD_DATA_ORDERED, CLEAR_MESSAGE,SET_TITLE, SHOW_LOADING, HIDE_LOADING, RE_FETCH_DATA } from "./types";

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});
export const setTitle = (title) => ({
  type: SET_TITLE,
  payload: title,
});


export const showLoading = (status) => ({
  type: SHOW_LOADING,
  payload: status,
});

export const hideLoading = () => ({
  type: HIDE_LOADING,
});

export const reFetchData = (status) => ({
  type: RE_FETCH_DATA,
  payload: status
});

export const reloadDataOrdered = (status) => ({
  type: LOAD_DATA_ORDERED,
  payload: status
});