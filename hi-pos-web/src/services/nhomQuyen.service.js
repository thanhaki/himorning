import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "nhomQuyen/"}`;

class NhomQuyenService {

    getAllNhomQuyen(data) {
        return client().get(URL + data);
    }

    getDataByGroupChucNang(data) {
        return client().post(URL + "GetDataByGroupChucNang",data);
    }


    addNhomQuyen(data) {
        return client().post(URL + "AddNhomQuyen", data);
    }

    deleteNhomQuyen(data) {
        return client().post(URL + "DeleteNhomQuyen", data);
    }

    GetAllNhomQuyenByIdData(data) {
        return client().post(URL + "GetAllNhomQuyenByIdData",data);
    }
}

export default new NhomQuyenService