import {
  SET_DANH_SACH_MATHANG,
  UPDATE_IS_CHECK_MATHANG,
  SET_DANH_SACH_KHUYENMAI_AD,
  UPDATE_IS_CHECK_KHUYENMAI_AD,
  SET_DANH_SACH_DANHMUC,
  UPDATE_IS_CHECK_DANHMUC,
} from "../actions/types";

const initialState = { danhSachMH: [], danhSachKmAd: [], danhSacDanhMuc: [] };


export default function productAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_DANH_SACH_MATHANG:
      return {
        ...state,
        danhSachMH: payload,
      };

    case UPDATE_IS_CHECK_MATHANG:
      const newListUpdate = state.danhSachMH.map((mh) => {
        if (payload.ma_MH === mh.ma_MH) {
          const updateItem = {
            ...mh,
            isCheck: payload.isCheck
          }
          return updateItem;
        }
        return mh;
      });
      return { ...state, danhSachMH: newListUpdate }

    case SET_DANH_SACH_KHUYENMAI_AD:
      return {
        ...state,
        danhSachKmAd: payload,
      };

    case UPDATE_IS_CHECK_KHUYENMAI_AD:
      const newListUpdateKM = state.danhSachKmAd.map((mh) => {
        if (payload.ma === mh.ma) {
          const updateItem = {
            ...mh,
            isCheck: payload.isCheck
          }
          return updateItem;
        }
        return mh;
      });
      return { ...state, danhSachKmAd: newListUpdateKM }

    case SET_DANH_SACH_DANHMUC:
      return {
        ...state,
        danhSacDanhMuc: payload,
      };

    case UPDATE_IS_CHECK_DANHMUC:
      const newListUpdateDanhMuc = state.danhSacDanhMuc.map((mh) => {
        if (payload.ma === mh.id) {
          const updateItem = {
            ...mh,
            isCheck: payload.isCheck
          }
          return updateItem;
        }
        return mh;
      });
      return { ...state, danhSacDanhMuc: newListUpdateDanhMuc }

    default:
      return state;
  }
}