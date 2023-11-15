import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "KhuyenMai/"}`;
class khuyenMaiService {

    getAllListKhuyenMai(data) {
        return client().get(URL + data);
    }

    deleteKhuyenMai(data) {
        return client().post(URL + "DeleteKhuyenMai", data);
    }

    addKhuyenMai(data) {
        return client().post(URL + "AddKhuyenMai", data);
    }

    updateKhuyenMai(data) {
        return client().post(URL + "UpdateKhuyenMai", data);
    }
  
    getListKmCheckAD(data) {
        return client().post(URL + "GetListKhuyenMaiCheckAD", data);
    }
    getListKmCheckDT(data) {
        return client().post(URL + "GetListKhuyenMaiCheckDT", data);
    }
    getListTime(data) {
        return client().post(URL + "GetListTimeKhuyenMai", data);
    }
}
export default new khuyenMaiService();