import axios from "axios";
import { API_URL } from "../helpers/utils";
import client from "../helpers/apiCaller";
const URL = `${API_URL + "user/"}`;
class AuthService {
  login(data) {
    return axios
      .post(URL + "login", data)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  
  refreshToken(data) {
    return client().post(URL + "refresh", data);
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();