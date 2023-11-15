import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "danhmuc/"}`;
class CategoriesService {
    getAllCategories(data) {
        return client().get(URL + data);
    }

    addCategory(data) {
        return client().post(URL + "AddDanhMucMatHang", data);
    }
    updateCategory(data) {
        return client().post(URL + "UpdateDanhMucMatHang", data);
    }
    deleteCategory(data) {
        return client().post(URL + "delete", data);
    }
}
export default new CategoriesService();