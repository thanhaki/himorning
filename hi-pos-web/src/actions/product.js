import {
    SET_DANH_SACH_MATHANG,
    UPDATE_IS_CHECK_MATHANG,
    SET_DANH_SACH_KHUYENMAI_AD,
    UPDATE_IS_CHECK_KHUYENMAI_AD,
    SET_DANH_SACH_DANHMUC,
    UPDATE_IS_CHECK_DANHMUC,
} from "./types";

export const setDanhSachMatHang = (data) => ({
    type: SET_DANH_SACH_MATHANG,
    payload: data
});

export const updateIsCheckMatHang = (data) => ({
    type: UPDATE_IS_CHECK_MATHANG,
    payload: data
});

export const setDanhSachKhuyenMaiAD = (data) => ({
    type: SET_DANH_SACH_KHUYENMAI_AD,
    payload: data
});

export const updateIsCheckKhuyenMaiAD = (data) => ({
    type: UPDATE_IS_CHECK_KHUYENMAI_AD,
    payload: data
});

export const setDanhSachDanhMuc = (data) => ({
    type: SET_DANH_SACH_DANHMUC,
    payload: data
});

export const updateIsCheckDanhMuc = (data) => ({
    type: UPDATE_IS_CHECK_DANHMUC,
    payload: data
});