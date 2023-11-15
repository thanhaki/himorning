import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "caLamViec/"}`

class WorkShiftService {

  getAllCaLamViec(data) {
    return client().get(URL + data);
  }

  addCaLamViec(data) {
    return client().post(URL + "AddCaLamViec", data);
  }
  updateCaLamViec(data) {
    return client().post(URL + "UpdateCaLamViec", data);
  }
  deleteCalamViec(data) {
    return client().post(URL + "DeleteCaLamViecById", data);
  }
}

export default new WorkShiftService();