import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "donvi/"}`;
class DonViService {
  register(data) {
    return client().post(URL,data);
  }

  getAllDonVi(data) {
    return client().post(URL + "search", data);
  }

  deleteDonVi(data) {
    return client().post(URL + "delete", data);
  }

  approvedDonVi(data) {
    return client().post(URL + "approved", data);
  }

  updateTinhTrangDonVi(data) {
    return client().post(URL + "updateTinhTrang", data);
  }
  
  updateSupporterDonVi(data) {
    return client().post(URL + "updateSupporter", data);
  }

  getDonViById(id) {
    return client().get(URL + id)
  }

  updateDonVi(data) {
    return client().put(URL, data)
  }

  updateImageDonVi(data) {
    return client().postForm(URL + "update-image-unit", data)
  }

  getDataNgonNguTheoNganhHang(id) {
    return client().get(URL + "get-ngon-ngu/" + id);
  }

  updateNgonNguTheoNganhHang(data) {
    return client().post(URL + "update-ngon-ngu", data);
  }
}
export default new DonViService();