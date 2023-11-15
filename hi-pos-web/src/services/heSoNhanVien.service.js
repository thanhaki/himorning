import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "NhanVienHeSo/"}`;
class heSoNhanVienService {

    getAllHeSoNhanVien(data) {
        return client().post(URL + "GetAllHeSoNhanVien", data);
    }
    addHeSoNhanVien(data) {
        return client().post(URL + "AddNhanVienHeSo", data);
    }

}
export default new heSoNhanVienService();