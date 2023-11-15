import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "PhieuThuChi/"}`;
class PhieuThuChiService {

    getAllPhieuThuChi(data) {
        return client().post(URL + "GetAllPhieuThuChi", data);
    }

    addPhieuThu(data) {
        return client().postForm(URL + "AddPhieuThu", data);
    }

    deletePhieuThuChi(data) {
        return client().post(URL + "DeletePhieuThuChi", data);
    }

    addPhieuChi(data) {
        return client().post(URL + "AddPhieuChi", data);
    }

    updatePhieuThuChi(data) {
        return client().postForm(URL + "UpdatePhieuThuChi", data);
    }
}
export default new PhieuThuChiService();