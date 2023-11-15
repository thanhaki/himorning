import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "KhachHang/"}`;
class khachHangService {

    getAllKhachHang(data) {
        return client().get(URL + "GetAllKhachHang/" + data);
    }

    deleteKhachHang(data) {
        return client().post(URL + "DeleteKhachHang", data);
    }

    addKhachHang(data) {
        return client().post(URL + "AddKhachHang", data);
    }

    getListKhByIdNhom(data) {
        return client().post(URL + "GetListKhachHangByIdNhom", data);
    }

    updateKhachHang(data) {
        return client().post(URL + "UpdateKhachHang", data);
    }

    getLoaiKhachHang(data) {
        return client().post(URL +"GetLoaiKhach", data);
    }

    GetListKhByLoaiKHThanhToan(data) {
        return client().get(URL + "GetListKhByLoaiKHThanhToan/" + data);
    }

    getListKhByLoaiKH(data) {
        return client().get(URL + "getListKhByLoaiKH/" + data);
    }

    getListHDByKh(data) {
        return client().get(URL + "GetAllHoaDonKh/" + data);
    }
    getListTichDiemByKh(data) {
        return client().get(URL + "GetLichSuTDKH/" + data);
    }
}
export default new khachHangService();