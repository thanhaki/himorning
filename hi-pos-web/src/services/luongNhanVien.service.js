import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "LuongNhanVien/"}`;
class LuongNhanVienSerVice {

    getAllLuong(data) {
        return client().post(URL + "GetAllLuongNhanVien", data);
    }
    updateLuongNhanVien(data) {
        return client().post(URL + "UpdateLuongNhanVien", data);
    }

    getLuongNhanVienById(data) {
        return client().post(URL + "LuongNhanVienById", data);
    }
}
export default new LuongNhanVienSerVice();