import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "TheThanhVien/"}`;
class theThanhVienService {

    getAllThe(data) {
        return client().get(URL + data);
    }

    deleteTheTV(data) {
        return client().post(URL + "DeleteTheTV", data);
    }

    addTheThanhTV(data) {
        return client().post(URL + "AddTheThanhVien", data);
    }

    updateTheTV(data) {
        return client().post(URL + "UpdateTheTV", data);
    }
    getKhachHangIsCheck(data) {
        return client().post(URL + "GetKhachHangIsCheckByIdThe", data);
    }
    updateKhachHangByIdThe(data) {
        return client().post(URL + "UpdateKhachHangByIdThe", data);
    }
    getKHByIdThe(data) {
        return client().post(URL + "GetKhachHangByIdThe", data);
    }
}
export default new theThanhVienService();