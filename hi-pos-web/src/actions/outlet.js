import { SET_OUTLET, SET_LIST_OUTLET, HIDE_LOADING, SHOW_LOADING } from "./types";
import OutletService from '../services/outlet.service';
import { showMessageByType } from '../helpers/handle-errors';
import { TYPE_ERROR } from '../helpers/handle-errors';
export const setOutlet = (data) => ({
  type: SET_OUTLET,
  payload: data,
});


export const setListOutlet = () => (dispatch) => {
  dispatch({ type: SHOW_LOADING, payload: true });

  return OutletService.getAllOutlet().then(
    (res) => {
      dispatch({ type: HIDE_LOADING});
      dispatch({ type: SET_LIST_OUTLET, payload: res.data});
      return Promise.resolve();
    },
    (error) => {
      dispatch({ type: HIDE_LOADING});
      showMessageByType(error,"Lấy thông tin khu vực thất bại", TYPE_ERROR.error)

      return Promise.reject();
    }
  );
};