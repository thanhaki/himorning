import { SET_SALES_LIST, SET_TT_DON_VI, SET_NGANH_HANG_LIST, SET_LOAI_DANHMUC_THUCHI, SET_LIST_HTTT, SET_TINHTRANG_DONHANG } from "../actions/types";

const initialState = {
  httt:[],
  htttDefault: 86,
  tinhTrangDonHang: [],
  listSalers: [],
  listNganhHangs: [],
  listTTDonVi:[]
};
export default function mdataAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SALES_LIST:
      return { ...state, listSalers: payload };

    case SET_TT_DON_VI:
      return { ...state, listTTDonVi: payload };

    case SET_NGANH_HANG_LIST:
      return { ...state, listNganhHangs: payload };

    case SET_LOAI_DANHMUC_THUCHI:
      return { ...state, loaiDanhMucThuChi: payload };

    case SET_LIST_HTTT:
      return { ...state, httt: payload };

    case SET_TINHTRANG_DONHANG:
      return { ...state, tinhTrangDonHang: payload };

    default:
      return state;
  }
}