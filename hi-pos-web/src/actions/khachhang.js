import {
    SET_DANH_SACH_KHACHHANG,
    UPDATE_IS_CHECK_KHACHHANG
} from "./types";

export const setDanhSachKhachHang = (data) => ({
    type: SET_DANH_SACH_KHACHHANG,
    payload: data
});

export const updateIsCheckKhachHang = (data) => ({
    type: UPDATE_IS_CHECK_KHACHHANG,
    payload: data
});