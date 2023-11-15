import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "DanhMucThuChi/"}`;
class DanhMucThuChiService {

    getAllDataDanhMuc(data) {
        return client().post(URL + "GetAllDanhMucThuChi", data);
    }

    addDanhMucThuChi(data) {
        return client().post(URL + "AddDanhMucThuChi", data);
    }
    updateDanhMucThuChi(data) {
        return client().post(URL + "UpdateDanhMucThuChi", data);
    }
    deleteDanhMucThuChi(data) {
        return client().post(URL + "DeleteDanhMucThuChi", data);
    }
}
export default new DanhMucThuChiService();