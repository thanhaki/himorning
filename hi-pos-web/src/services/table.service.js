import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "table/"}`

class TableService {
  getResultCheckTheSalesGuideSection(data) {
    return client().get(URL + "GetResultCheckTheSalesGuide/" + data);
  }

  getResultCheckTheHRAdministrativeManual(data) {
    return client().get(URL + "GetResultCheckTheHRAdministrativeManual/" + data);
  }

  getResultGetResultCheckGuideToRevenueAndExpenditure(data) {
    return client().get(URL + "GetResultCheckGuideToRevenueAndExpenditure/" + data);
  }

  deleteTable(data) {
    return client().post(URL + "delete", data);
  }

  updateTable(data) {
    return client().post(URL + "update", data);
  }
}

export default new TableService();