import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "NhomKhachHang/"}`;
class nhomKhachHangService {

    getAllNhomKhachHang(data) {
        return client().get(URL + data);
    }

    deleteNhomKhachHang(data) {
        return client().post(URL + "DeleteNhomKhachHang", data);
    }

    addNhomKhachHang(data) {
        return client().post(URL + "AddNhomKhachHang", data);
    }

    updateNhomKhachHang(data) {
        return client().post(URL + "UpdateNhomKhachHang", data);
    }

    getKhachHangIsCheck(data) {
        return client().post(URL + "GetKhachHangIsCheckByIdNhom", data);
    }

    updateKhachHangByIdNhom(data) {
        return client().post(URL + "UpdateKhachHangByIdNhom", data);
    }

}
export default new nhomKhachHangService();