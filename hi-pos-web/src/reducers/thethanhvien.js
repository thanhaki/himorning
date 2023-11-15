import {
    SET_DANH_SACH_THE_THANHVIEN,
    UPDATE_IS_CHECK_THE_THANHVIEN,
    SET_DANH_SACH_NHOM_KH,
    UPDATE_IS_CHECK_NHOM_KH
  } from "../actions/types";
  
  const initialState = { danhSachDT: [], danhSachTTV: [] };

  export default function DoiTuongKMAction(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_DANH_SACH_THE_THANHVIEN:
        return {
          ...state,
          danhSachDT: payload,
        };
  
      case UPDATE_IS_CHECK_THE_THANHVIEN:
        const newListUpdate = state.danhSachDT.map((tv) => {
          if (payload.ma === tv.ma) {
            const updateItem = {
              ...tv,
              isCheck: payload.isCheck
            }
            return updateItem;
          }
          return tv;
        });
        return { ...state, danhSachDT: newListUpdate }
  
      case SET_DANH_SACH_NHOM_KH:
        return {
          ...state,
          danhSachTTV: payload,
        };
  
      case UPDATE_IS_CHECK_NHOM_KH:
        const newListUpdateKM = state.danhSachTTV.map((kh) => {
          if (payload.ma === kh.ma) {
            const updateItem = {
              ...kh,
              isCheck: payload.isCheck
            }
            return updateItem;
          }
          return kh;
        });
        return { ...state, danhSachTTV: newListUpdateKM }
  
      default:
        return state;
    }
  }