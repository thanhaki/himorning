import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "printer/"}`;
class PrinterService {

    getAllDataPrinter(data) {
        return client().get(URL +  data);
    }

    addPrinter(data) {
        return client().post(URL + "AddPrinter", data);
    }
    updatePrinter(data) {
        return client().post(URL + "UpdatePrinter", data);
    }
    deletePrinter(data) {
        return client().post(URL + "DeletePrinter", data);
    }
}
export default new PrinterService();