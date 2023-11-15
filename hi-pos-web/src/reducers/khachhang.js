import {
    SET_DANH_SACH_KHACHHANG,
    UPDATE_IS_CHECK_KHACHHANG
  } from "../actions/types";
  
  const initialState = { danhSachKH: [] };
  
  
  export default function productAction(state = initialState, action) {
    const { type, payload } = action;
    
    switch (type) {
      case SET_DANH_SACH_KHACHHANG:
        return {
          ...state,
          danhSachKH: payload,
        };
  
      case UPDATE_IS_CHECK_KHACHHANG :
        const newListUpdate = state.danhSachKH.map((kh) => {
          if (payload.ma_KH === kh.ma_KH) {
            const updateItem = {
              ...kh,
              isCheck: payload.isCheck
            }
            return updateItem;
          }
          return kh;
        });
        return { ...state, danhSachKH: newListUpdate }
  
      default:
        return state;
    }
  }