import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "PhieuNhapXuat/"}`;
class phieuNhapXuatService {

  
    getAllLoaiPhieu(data) {
        return client().post(URL + "GetLoaiPhieuByType", data);
    }

    addPhieuNhapX(data) {
        return client().postForm(URL + "AddPhieuNhapXuat", data);
    }

    getListPhieuNhapXSearch(data) {
        return client().post(URL + "GetAllPhieuNhapXuat", data);
    }

    updatePhieuNhapX(data) {
        return client().post(URL + "UpdatePhieuNhapX", data);
    }

    getProductSearch(data) {
        return client().post(URL + "GetAllProduct", data);
    }

    getChiTietPhieu(data) {
        return client().post(URL + "GetChiTietPhieu", data);
    }
    getKiemKeSLMatHang(data) {
        return client().post(URL + "GetSoLuongProduct", data);
    }
    getChiTietPhieuKiemKe(data) {
        return client().post(URL + "GetCTPKiemKe", data);
    }
    updateTrangThaiHuy(data) {
        return client().post(URL + "UpdateTrangThai", data);
    }
}
export default new phieuNhapXuatService();