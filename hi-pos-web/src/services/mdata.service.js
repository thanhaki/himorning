import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "mdata/"}`
class MDataService {
  getMaDataByGroupDataList() {
    return client().get(URL + "getbygroupdata", null);
  }

  getMaDataByGroupName(data) {
    return client().post(URL + "getbygroupdata", data);
  }
}

export default new MDataService();