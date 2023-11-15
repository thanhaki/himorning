import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "httt/"}`

class HTTTService {
  
  getAllHttt() {
    return client().get(URL);
  }
  addHinhThucTT(data) {
    return client().post(URL + "AddHinhThucTT", data);
  }
  updateHinhThucTT(data) {
    return client().post(URL + "UpdateHinhThucTT", data);
  }
}

export default new HTTTService();