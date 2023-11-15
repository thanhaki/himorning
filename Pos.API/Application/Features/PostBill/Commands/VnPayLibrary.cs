using Pos.API.Models;
using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;

namespace Pos.API.Application.Features.PostBill.Commands
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public PaymentResponseModel GetFullResponseData(IQueryCollection collection, string hashSecret)
        {
            var vnPay = new VnPayLibrary();

            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            var orderId = Convert.ToString(vnPay.GetResponseData("vnp_TxnRef"));
            var vnPayTranId = Convert.ToInt64(vnPay.GetResponseData("vnp_TransactionNo"));
            string vnp_TransactionStatus = vnPay.GetResponseData("vnp_TransactionStatus");
            var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            var vnpSecureHash =
                collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value; //hash của dữ liệu trả về
            var orderInfo = vnPay.GetResponseData("vnp_OrderInfo");

            var checkSignature =
                vnPay.ValidateSignature(vnpSecureHash, hashSecret); //check Signature

            // thanh toan thanh cong
            if (vnpResponseCode == "00")
            {
                return new PaymentResponseModel()
                {
                    Success = true,
                    PaymentMethod = "VnPay",
                    OrderDescription = orderInfo,
                    OrderId = orderId.ToString(),
                    PaymentId = vnPayTranId.ToString(),
                    TransactionId = vnPayTranId.ToString(),
                    Token = vnpSecureHash,
                    VnPayResponseCode = vnpResponseCode
                };
            }
            // thanh toan khong thanh cong
            else
            {
                //00  Giao dịch thành công
                //07  Trừ tiền thành công.Giao dịch bị nghi ngờ(liên quan tới lừa đảo, giao dịch bất thường).
                //09  Giao dịch không thành công do: Thẻ / Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.
                //10  Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ / tài khoản không đúng quá 3 lần
                //11  Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.
                //12  Giao dịch không thành công do: Thẻ / Tài khoản của khách hàng bị khóa.
                //13  Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch(OTP).Xin quý khách vui lòng thực hiện lại giao dịch.
                //24  Giao dịch không thành công do: Khách hàng hủy giao dịch
                //51  Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.
                //65  Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.
                //75  Ngân hàng thanh toán đang bảo trì.
                //79  Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch
                //99  Các lỗi khác(lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)
                switch (vnpResponseCode)
                {
                    case "07":
                        orderInfo = "Trừ tiền thành công.Giao dịch bị nghi ngờ(liên quan tới lừa đảo, giao dịch bất thường).";
                        break;
                    case "09":
                        orderInfo = "Giao dịch không thành công do: Thẻ / Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.";
                        break;
                    case "10":
                        orderInfo = "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ / tài khoản không đúng quá 3 lần";
                        break;
                    case "11":
                        orderInfo = "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.";
                        break;
                    case "12":
                        orderInfo = "Giao dịch không thành công do: Thẻ / Tài khoản của khách hàng bị khóa.";
                        break;
                    case "13":
                        orderInfo = "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch(OTP).Xin quý khách vui lòng thực hiện lại giao dịch.";
                        break;
                    case "24":
                        orderInfo = "Giao dịch không thành công do: Khách hàng hủy giao dịch";
                        break;
                    case "51":
                        orderInfo = "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
                        break;
                    case "65":
                        orderInfo = "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.";
                        break;
                    case "75":
                        orderInfo = "Ngân hàng thanh toán đang bảo trì.";
                        break;
                    case "79":
                        orderInfo = "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch";
                        break;
                    default:
                        orderInfo = "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)";
                        break;
                }

                return new PaymentResponseModel()
                {
                    Success = false,
                    PaymentMethod = "VnPay",
                    OrderDescription = orderInfo,
                    OrderId = orderId.ToString(),
                    PaymentId = vnPayTranId.ToString(),
                    TransactionId = vnPayTranId.ToString(),
                    Token = vnpSecureHash,
                    VnPayResponseCode = vnpResponseCode
                };
            }
        }
        public string GetIpAddress(HttpContext context)
        {
            var ipAddress = string.Empty;
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;

                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }

                    if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                    return ipAddress;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "127.0.0.1";
        }
        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();

            foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            var querystring = data.ToString();

            baseUrl += "?" + querystring;
            var signData = querystring;
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            var vnpSecureHash = HmacSha512(vnpHashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnpSecureHash;

            return baseUrl;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var rspRaw = GetResponseData();
            var myChecksum = HmacSha512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSha512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }

            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            //remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }

            return data.ToString();
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}