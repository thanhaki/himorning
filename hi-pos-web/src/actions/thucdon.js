
import {
    SET_THUC_DON,
    SET_LIST_THUC_DON,
    SET_ORDER_NEWLIST,
    ADD_MENU_TO_ORDER,
    REMOVE_MENU_ORDER,
    UPDATE_MENU_ORDER,
    SET_CHIETKHAU_BILL,
    SET_TOTAL_AMOUNT,
    SET_ORDERED_LIST,
    SET_LOAI_DON_HANG,
    SET_FILTER_DATA,
    SET_ID_BILL_DELETE,
    SET_LIST_BILL,
    SET_KHUYEN_MAI
} from "./types";

export const setThucDon = (data) => ({
    type: SET_THUC_DON,
    payload: data
});

export const setListThucDon = (data) => ({
    type: SET_LIST_THUC_DON,
    payload: data
});

export const setOrderNewList = (data) =>({
    type: SET_ORDER_NEWLIST,
    payload: data
});
export const setOrderedList = (data) =>({
    type: SET_ORDERED_LIST,
    payload: data
});

export const addMenuToOrder = (data) =>({
    type: ADD_MENU_TO_ORDER,
    payload: data
});

export const removeMenuOrder = (data) =>({
    type: REMOVE_MENU_ORDER,
    payload: data
});

export const updateMenuOrder = (data) =>({
    type: UPDATE_MENU_ORDER,
    payload: data
});

export const setChietKhauBill = (data) =>({
    type: SET_CHIETKHAU_BILL,
    payload: data
});

export const setTotalAmount = (data) =>({
    type: SET_TOTAL_AMOUNT,
    payload: data
});

export const setLoaiDonHang = (data) =>({
    type: SET_LOAI_DON_HANG,
    payload: data
});

export const setObjectFilterData = (data) =>({
    type: SET_FILTER_DATA,
    payload: data
});

export const setBillIdDelete = (data) =>({
    type: SET_ID_BILL_DELETE,
    payload: data
});

export const setListBill = (data) =>({
    type: SET_LIST_BILL,
    payload: data
});
export const setKhuyenMai = (data) =>({
    type: SET_KHUYEN_MAI,
    payload: data
});