import {
  SET_LIST_TABLE,
  UPDATE_LIST_TABLE,
  ADD_NEW_TABLE,
  REMOTE_TABLE,
  SET_OUTLET,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_TABLE_CURRENT,
} from "./types";
import OutletService from '../services/outlet.service';

export const updateTableList = (data) => ({
  type: UPDATE_LIST_TABLE,
  payload: data
});
export const addNewTable = (data) => ({
  type: ADD_NEW_TABLE,
  payload: data
});

export const removeTable = (data) => ({
  type: REMOTE_TABLE,
  payload: data
});

export const setTableCurrent = (data) => ({
  type: SET_TABLE_CURRENT,
  payload: data
});

export const setTablesList = (data) => (dispatch) => {
  dispatch({ type: SHOW_LOADING, payload: true });
  return OutletService.getOutletById(data).then(
    (res) => {
      dispatch({ type: SET_LIST_TABLE, payload: res.data.tables });
      const {donVi,ma_Outlet,soLuongBan,ten_Outlet} =res.data;
      var outlet = {
        ma_Outlet:ma_Outlet,
        donVi: donVi,
        soLuongBan: soLuongBan,
        ten_Outlet: ten_Outlet
      }
      dispatch({ type: SET_OUTLET, payload: outlet });
      dispatch({ type: HIDE_LOADING });
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({ type: HIDE_LOADING });
      return Promise.reject();
    }
  );
};