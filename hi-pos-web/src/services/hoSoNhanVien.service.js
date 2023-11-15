import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "HoSoNhanVien/"}`;
class hoSoNhanVienService {

    getAllHoSoNv(data) {
        return client().post(URL + "GetAllHoSoNhanVien", data);
    }
    GetMDataPbTinhTr(data) {
        return client().post(URL + "GetLoaiPbTinhTrang",data);
    }
    addHoSoNhanVien(data) {
        return client().postForm(URL + "AddHoSoNhanVien", data);
    }
    getChiTietHoSoNv(data) {
        return client().post(URL + "GetChiTietHoSoNV", data);
    }
    deleteHoSoNV(data) {
        return client().post(URL + "DeleteHoSoNV", data);
    }

    deleteFileHoSoNV(data) {
        return client().post(URL + "DeleteChiTietHoSoNV", data);
    }

}
export default new hoSoNhanVienService();