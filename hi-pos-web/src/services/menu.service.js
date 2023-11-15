import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "ThucDon/"}`;
class MenuService {
    getAllThucDon(data) {
        return client().get(URL + data);
    }
    GetAllThucDonMatHangById(data) {
        return client().post(URL + "GetAllThucDonMatHangById", data);
    }

    addThucDon(data) {
        return client().post(URL + "AddThucDon", data);
    }
    updateThucDon(data) {
        return client().post(URL + "UpdateThucDon", data);
    }
    deleteThucDon(data) {
        return client().post(URL + "DeleteThucDon", data);
    }
    getMatHangToCheckThucDon(data) {
        return client().post(URL + "getMatHangToCheckThucDon", data);
    }
    updateSort(data) {
        return client().postForm(URL + "UpdateThucDonSort", data);
    }
}
export default new MenuService();