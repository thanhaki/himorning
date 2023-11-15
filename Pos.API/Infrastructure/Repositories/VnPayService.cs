using Pos.API.Application.Features.PostBill.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Models;
using System.Collections;
using System.Collections.Generic;

namespace Pos.API.Infrastructure.Repositories
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

            pay.AddRequestData("vnp_Version", _configuration["VNPaySetting:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["VNPaySetting:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["VNPaySetting:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["VNPaySetting:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["VNPaySetting:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + model.MaDonHang);
            pay.AddRequestData("vnp_OrderType", "other");
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", model.MaDonHang);

            var paymentUrl = pay.CreateRequestUrl(_configuration["VNPaySetting:BaseUrl"], _configuration["VNPaySetting:HashSecret"]);

            return paymentUrl;
        }
        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["VNPaySetting:HashSecret"]);

            return response;
        }
    }
}
