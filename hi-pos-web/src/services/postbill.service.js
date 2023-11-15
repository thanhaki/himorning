import client from "../helpers/apiCaller";
import { API_URL } from "../helpers/utils";

const URL = `${API_URL + "postbill/"}`

class PostBillService {
  
  getMenuProduct(data) {
    return client().get(URL + data);
  }
  
  getLoaiDonHang(data) {
    return client().get(URL + "loaidonhang/"+ data);
  }

  createOrder(data) {
    return client().post(URL + "createorder", data);
  }

  getOrderedByTableNo(data) {
    return client().post(URL + "gettableordered", data);
  }

  cancelOrderById(data) {
    return client().post(URL + "cancelorder", data);
  }

  payment(data) {
    return client().post(URL + "payment", data);
  }

  vnPayQr(data) {
    return client().post(URL + "VnpayQr", data);
  }
  paymentCallback(data) {
    return client().post(URL + "PaymentCallback", data);
  }
  printBill(data) {
    return client().post(URL + "print-bill", data);
  }
  
  updateSoLanIn(data) {
    return client().post(URL + "update-nums-print", data);
  }

  getalluser() {
    return client().get(URL + "getalluser");
  }

  getallbill(data) {
    return client().post(URL + "getallbill", data);
  }
  
  deletebill(data) {
    return client().post(URL + "deletebill", data);
  }

  updateInTamTinh(data) {
    return client().post(URL + "update-intamtinh", data);
  }

  stopCalTime(data) {
    return client().post(URL + "stop-timer", data);
  }
}

export default new PostBillService();