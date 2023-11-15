import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "outlet/"}`

class OutletService {
  addOutlet(data) {
    return client().post(URL, data);
  }

  getAllOutlet() {
    return client().get(URL);
  }

  deleteOutlet(data) {
    return client().post(URL + "delete", data);
  }

  getOutletById(data) {
    return client().post(URL + "GetOutletById", data);
  }

  AddTableToOutlet(data) {
    return client().post(URL + "AddTableToOutlet", data);
  }
}

export default new OutletService();