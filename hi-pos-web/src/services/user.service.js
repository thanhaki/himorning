import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "user/"}`
class UserService {
  forgotPassword(data) {
    return client().post(URL + 'forgotpassword',data);
  }

  getUserById(data) {
    return client().post(URL + 'getuser',data);
  }

  changePassword(data) {
    return client().post(URL + 'ChangePassword',data);
  }
}

export default new UserService();