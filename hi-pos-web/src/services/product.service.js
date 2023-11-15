import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "mathang/"}`;
class ProductService {
    getAllProduct(data) {
        return client().post(URL + "GetAllMatHang", data);
    }
    filterProduct(data) {
        return client().post(URL + "Filter", data);
    }
    addProduct(formData) {
        return client().postForm(URL + "AddMatHang", formData);
    }
    deleteProduct(data) {
        return client().post(URL + "DeleteMatHang", data);
    }
    updateMatHangById(data) {
        return client().post(URL + "UpdateMatHangById", data);
    }
    GetMatHangByIdDonViMatHang(data) {
        return client().post(URL + "GetMatHangByIdDonViMatHang", data);
    }
    getLoaiMatHang(data) {
        return client().get(URL + data);
    }
    UpdateChiTietMatHangById(formData) {
        return client().postForm(URL + "UpdateChiTietMatHangById", formData);
    }
    getAllProductSearch(data) {
        return client().post(URL + "GetAllProductSearch", data);
    }
    
    GetMatHangByIdMatHang(data) {
        return client().post(URL + "GetMatHangByIdMatHang", data);
    }

    getMatHangByQRCode(qrcode) {
        return client().get(URL + "GetMatHangByIdQRCode/" + qrcode);
    }
    importProduct(formData) {
        return client().postForm(URL + "ImportProduct", formData);
    }
    coppyProduct(data) {
        return client().post(URL + "CoppyProduct", data);
    }
}
export default new ProductService();