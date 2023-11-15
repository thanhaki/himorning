import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "nhanVien/"}`;

class NhanVienService {

    GetAllNhanVien(data) {
        return client().get(URL + data);
    }

    addNhanVien(data) {
        return client().post(URL + "AddNhanVien", data);
    }

    updateNhanVien(data) {
        return client().post(URL + "UpdateNhanVien", data);
    }
    deleteNhanVien(data) {
        return client().post(URL + "DeleteNhanVien", data);
    }
    
}

export default new NhanVienService