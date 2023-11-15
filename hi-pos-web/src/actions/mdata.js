import { SET_TT_DON_VI, SET_SALES_LIST, SET_NGANH_HANG_LIST, SET_LOAI_DANHMUC_THUCHI, SET_LIST_HTTT, SHOW_LOADING, HIDE_LOADING, SET_TINHTRANG_DONHANG} from "./types";
import htttService from '../services/httt.service';

import { showMessageByType, TYPE_ERROR } from '../helpers/handle-errors';
export const setTTDonVi = (data) => ({
  type: SET_TT_DON_VI,
  payload: data,
});

export const setSalersList = (data) => ({
  type: SET_SALES_LIST,
  payload: data,
});

export const setNganhHangList = (data) => ({
  type: SET_NGANH_HANG_LIST,
  payload: data,
});

export const setLoaiDanhMucThuChi = (data) => ({
  type: SET_LOAI_DANHMUC_THUCHI,
  payload: data,
});

export const setTinhTrangDonHang = (data) => ({
  type: SET_TINHTRANG_DONHANG,
  payload: data,
});

export const getAllHttt = () => (dispatch) => {
  dispatch({ type: SHOW_LOADING, payload: true });
  return htttService.getAllHttt().then(
    (res) => {
      const httt = res.data?.filter(x=>x.tinhTrangHinhThucThanhToan === 1);
      if (!httt) {
        dispatch({ type: SET_LIST_HTTT, payload: res.data });
      } else {
        dispatch({ type: SET_LIST_HTTT, payload: httt });
      }
      dispatch({ type: HIDE_LOADING });
      return Promise.resolve();
    },
    (error) => {
      showMessageByType(error,"Lấy thông tin hình thức thanh toán thất bại", TYPE_ERROR.error)
      dispatch({ type: HIDE_LOADING });
      return Promise.reject();
    }
  );
};