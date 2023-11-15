import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "electronic-menu/"}`;
class ElectronicService {
    updatProductDetail(data) {
        return client().postForm(URL + "update-description-production/", data);
    }

    getAllThucDonMatHang(donVi) {
        return client().get(URL + donVi);
    }
       
    GetMatHangByIdMatHang(data) {
        return client().post(URL + "GetMatHangByIdMatHang", data);
    }

}
export default new ElectronicService();