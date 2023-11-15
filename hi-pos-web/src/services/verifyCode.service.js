import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "verifycode/"}`
class VerifyCodeService {
  validate(data) {
    return client().post(URL + "validate", data);
  }

  sendcode(data) {
    return client().post(URL + "sendcode", data);
  }
}

export default new VerifyCodeService();