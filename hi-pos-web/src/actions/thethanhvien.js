import {
    SET_DANH_SACH_THE_THANHVIEN,
    UPDATE_IS_CHECK_THE_THANHVIEN,
    SET_DANH_SACH_NHOM_KH,
    UPDATE_IS_CHECK_NHOM_KH
} from "./types";


export const setDanhSachTheTv = (data) => ({
    type: SET_DANH_SACH_THE_THANHVIEN,
    payload: data
});

export const updateIsCheckTheTv = (data) => ({
    type: UPDATE_IS_CHECK_THE_THANHVIEN,
    payload: data
});

export const setDanhSachNhomKh = (data) => ({
    type: SET_DANH_SACH_NHOM_KH,
    payload: data
});

export const updateIsCheckNhomKh = (data) => ({
    type: UPDATE_IS_CHECK_NHOM_KH,
    payload: data
});
