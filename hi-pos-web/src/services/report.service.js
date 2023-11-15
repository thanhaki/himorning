import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "baocao/"}`
const URL_EXPORT = `${API_URL + "export/"}`

class ReportService {
  getDataReportDTTongQuan(data) {
    return client().post(URL + "doanhthutongquan", data);
  }

  getDataReportDTHTTT(data) {
    return client().post(URL + "doanhthuHttt", data);
  }
  
  getDataReportDTPhucVu(data) {
    return client().post(URL + "doanhthuPhucVu", data);
  }

  getDataReportDTThuNgan(data) {
    return client().post(URL + "doanhthuThuNgan", data);
  }

  getDataReportDTLoaiDH(data) {
    return client().post(URL + "doanhthuloaiDH", data);
  }

  getDataReportDTHuyDH(data) {
    return client().post(URL + "doanhthuHuyDH", data);
  }

  getDataReportDanhMucMH(data) {
    return client().post(URL + "danhmuc-mathang", data);
  }

  getDataReportMHBanChay(data) {
    return client().post(URL + "mathang-banchay", data);
  }
  
  getDataReportMHDaHuy(data) {
    return client().post(URL + "mathang-dahuy", data);
  }

  getBaoCaoKetQuaKD(data) {
    return client().post(URL + "taichinh-kqkd", data);
  }

  exportBaoCaoKetQuaKD(data) {
    return client().postExport(URL_EXPORT + "bao-cao-tai-chinh", data);
  }
}

export default new ReportService();