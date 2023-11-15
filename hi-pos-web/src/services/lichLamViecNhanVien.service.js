import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "LichLamViecNhanVien/"}`;
class LichLamViecService {

    getAllLichLamViec(data) {
        return client().post(URL + "GetAllLichLamViec", data);
    }
    addLichLamViec(data) {
        return client().post(URL + "AddLichLamViec", data);
      }
    
}
export default new LichLamViecService();