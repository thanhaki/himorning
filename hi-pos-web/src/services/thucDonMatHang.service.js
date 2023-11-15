import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "ThucDonMatHang/"}`;
class MenuItemService {

    getThucDonMhBy(data) {
        return client().get(URL + "GetThucDonMatHangByMH/" + data);
    }

    AddThucDonMatHang(data) {
        return client().post(URL + "ThucDonMatHang", data);
    }

    deleteThucDonMatHang(data) {
        return client().post(URL + "DeleteThucDonMatHang", data);
    }
    getMatHangToCheckThucDon(data) {
        return client().post(URL + "getMatHangToCheckThucDon", data);
    }
}
export default new MenuItemService();