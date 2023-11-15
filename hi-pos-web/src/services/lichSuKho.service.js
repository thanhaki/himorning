import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "LichSuKho/"}`;
class LichSuKhoService {

    getAllLichSuKho(data) {
        return client().post(URL + "GetAllLichSuKho", data);
    }

    getDanhSachTonKho(data) {
        return client().get(URL + data);
    }
    getFilterMh(data) {
        return client().post(URL + "GetFilterMatHangKho", data);
    }
}
export default new LichSuKhoService();