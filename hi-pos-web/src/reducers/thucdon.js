import {
  SET_THUC_DON, SET_LIST_THUC_DON,
  SET_ORDER_NEWLIST,
  ADD_MENU_TO_ORDER,
  UPDATE_MENU_ORDER,
  REMOVE_MENU_ORDER,
  SET_CHIETKHAU_BILL,
  SET_TOTAL_AMOUNT,
  SET_ORDERED_LIST,
  SET_LOAI_DON_HANG,
  SET_FILTER_DATA,
  SET_ID_BILL_DELETE,
  SET_LIST_BILL,
  SET_KHUYEN_MAI
} from "../actions/types";
import { TINH_TIEN_THEO_THOI_GIAN } from "../consts/constsCommon";

const initialState = {
  thucdon: {},
  listThucDon: [],
  orderedList: {
    soDonHang: 0,
    maDonHang: 0
  },
  orderNewList: [],
  chietKhauBill: {
    loaiCk: 1,
    valueCk: '0'
  },
  totalAmount: 0,
  loaiDonHang: 81,
  filterData: {
    maDonHang: '',
    thungan: [],
    phucvu: [],
    khuvuc: [],
    phuongThucThanhToan: [],
    thoigian: {
      isFilterTheoNgay: false,
      tungay: '',
      denngay: ''
    },
    khachHang: [],
    tinhTrangDH: []
  },
  billIdsDelete:[],
  listBills: [],
  khuyenMai:{}
};


export default function thucdonAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {

    case SET_THUC_DON:
      return {
        ...state,
        thucdon: payload,
      };
    case SET_LIST_THUC_DON:
      return {
        ...state,
        listThucDon: payload,
      };

    case SET_ORDERED_LIST:
      return {
        ...state,
        orderedList: payload,
      };

    case SET_ORDER_NEWLIST:
      return {
        ...state,
        orderNewList: payload,
      };

    case ADD_MENU_TO_ORDER:
      return {
        ...state,
        orderNewList: state.orderNewList.concat(payload)
      };

    case UPDATE_MENU_ORDER:
      const newList = state.orderNewList.map((item) => {
        if (payload.id === item.id) {
          let soLuong = payload.id_LoaiMH === TINH_TIEN_THEO_THOI_GIAN ? 1 : (payload.soLuong ? payload.soLuong : 0) + item.soLuong;
          const updatedItem = {
            ...item,
            soLuong: soLuong,
            ghiChu: payload.ghiChu ? payload.ghiChu : item.ghiChu,
            chietKhau: payload.chietKhau ? payload.chietKhau : item.chietKhau,
            gioRa: payload.gioRa ? payload.gioRa : item.gioRa,
            gioVao: payload.gioVao ? payload.gioVao : item.gioVao,
          };
          return updatedItem;
        }
        return item;
      });
      return { ...state, orderNewList: newList.filter(x => x.soLuong === 0 && x.soDonHang > 0 || x.soLuong > 0) };
    case REMOVE_MENU_ORDER:
      return {
        ...state,
        orderNewList: state.orderNewList.filter(item => item !== payload),
      };
    case SET_CHIETKHAU_BILL:
      const resetData = {
        loaiCk: 1,
        valueCk: '0'
      }

      if (payload) {
        return {
          ...state,
          chietKhauBill: payload
        };
      } else {
        return {
          ...state,
          chietKhauBill: resetData
        };
      }
    case SET_TOTAL_AMOUNT:
      return {
        ...state,
        totalAmount: payload
      }
    case SET_LOAI_DON_HANG:
      return {
        ...state,
        loaiDonHang: payload
      }

    case SET_FILTER_DATA: {
      if (!payload) {
        return {
          ...state,
          filterData: initialState.filterData
        }
      }
      return {
        ...state,
        filterData: payload
      }
    }
    case SET_ID_BILL_DELETE: {
      return {
        ...state,
        billIdsDelete: payload
      }
    }

    case SET_LIST_BILL: {
      return {
        ...state,
        listBills: payload
      }
    }

    case SET_KHUYEN_MAI: {
      return {
        ...state,
      khuyenMai: payload
      }
    }
    default:
      return state;
  }
}