import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "DonViMatHang/"}`;
class ProductUnitService {
    getAllProductUnit(data) {
        return client().get(URL + data);
    }

    addProductUnit(data) {
        return client().post(URL + "AddDonViMatHang", data);
    }
    updateProductUnit(data) {
        return client().post(URL + "UpdateDonViMatHang", data);
    }
    deleteProductUnit(data) {
        return client().post(URL + "DeleteDonViMatHang", data);
    }
}
export default new ProductUnitService();