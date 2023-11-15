using AutoMapper;
using MediatR;
using Microsoft.Extensions.Options;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Domain.Entities;
using Pos.API.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.PostBill.Commands.VnPay
{
    public class VnPay_payCommand
    {
        public class VnPayRequest : IRequest<string>
        {
            [Required]
            public string MaDonHang { set; get; }
            [Required]
            public int SoDonHang { set; get; }
            public int? DonVi { set; get; }
            public string? Timestamp { get; set; }
        }
        public class Handler : IRequestHandler<VnPayRequest, string>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IDonHangChiTietRepository _donHangChiTietRepository;
            private readonly IMatHangRepository _matHangRepository;
            private readonly ILogger<VnPay_payCommand> _logger;
            private readonly VNPaySetting _vnPaySetting;
            private readonly PaymentCallBack _paymentCallBack;

            public Handler(
                IDonHangRepository donHangRepository,
                ILogger<VnPay_payCommand> logger,
                IDonHangChiTietRepository donHangChiTietRepository,
                IMatHangRepository matHangRepository,
                IOptions<VNPaySetting> vnPaySetting,
                IOptions<PaymentCallBack> paymentCallBack)
            {
                _vnPaySetting = vnPaySetting.Value;
                _paymentCallBack = paymentCallBack.Value;
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donHangChiTietRepository = donHangChiTietRepository ?? throw new ArgumentNullException(nameof(donHangChiTietRepository));
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
            }

            public async Task<string> Handle(VnPayRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    //_donHangRepository.BeginTransactionAsync();

                    Expression<Func<T_DonHang, bool>> expression = x => x.MaDonHang == request.MaDonHang && x.SoDonHang == request.SoDonHang && x.DonVi == request.DonVi;
                    var dh = await _donHangRepository.GetFirstOrDefaultAsync(expression);

                    Expression<Func<T_DonHangChiTiet, bool>> getdhct = x => x.MaDonHang == request.MaDonHang && x.SoDonHang == request.SoDonHang && x.DonVi == request.DonVi;
                    var dhct = await _donHangChiTietRepository.GetAsync(getdhct);

                    if (dh == null)
                    {
                        //_donHangRepository.CommitTransactionAsync();
                        return "-1";
                    }

                    // Kiểm tra đơn hàng có đang update bởi các user khác không
                    if (!string.IsNullOrEmpty(request.Timestamp))
                    {
                        var currentTs = BitConverter.ToUInt64(dh.Timestamp, 0).ToString();
                        if (currentTs != request.Timestamp)
                        {
                            //_donHangRepository.CommitTransactionAsync();
                            return "-2";
                        }
                    }

                    decimal soThoiGian = 1;
                    decimal total = 0;
                    int totalMH = dhct.Count;

                    foreach (var item in dhct)
                    {

                        Expression<Func<M_MatHang, bool>> getMH = x => x.Ma_MH == item.Ma_MH && x.Deleted == 0 && x.DonVi == request.DonVi;
                        var matHang = await _matHangRepository.GetFirstOrDefaultAsync(getMH);
                        if (matHang != null)
                        {
                            item.LoaiChietKhau = item.LoaiChietKhau;
                            decimal price = 0;
                            if (matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                price = (item.SoLuong_MH * GiaMoiPhut(matHang) * soThoiGian);
                                total += price;
                            }
                            else
                            {
                                price = item.SoLuong_MH * item.DonGia_MH;
                                total += price;
                            }
                        }
                    }
                    dh.Tien_DonHang = total;

                    //url thanh toán vnpay
                    //if (request.vnPay_PaymentInfo.Select(x => x.TenHinhThucThanhToan == "VNPAY-QR").ToList().Count > 0)
                    //{
                    //    //Get Config Info

                    //}
                    string vnp_Returnurl = _paymentCallBack.Returnurl; //URL nhan ket qua tra ve 
                    //string vnp_Url = _vnPaySetting.Url; //URL thanh toan cua VNPAY 
                    string vnp_Url = string.Empty; //URL thanh toan cua VNPAY 
                    string vnp_TmnCode = _vnPaySetting.TmnCode; //Ma định danh merchant kết nối (Terminal Id)
                    string vnp_HashSecret = _vnPaySetting.HashSecret; //Secret Key

                    //Get payment input
                    OrderInfo order = new OrderInfo();
                    order.OrderId = dh.MaDonHang; // Giả lập mã giao dịch hệ thống merchant gửi sang VNPAY
                    order.Amount = (long)dh.Tien_DonHang; // Giả lập số tiền thanh toán hệ thống merchant gửi sang VNPAY 100,000 VND
                    order.Status = "0"; //0: Trạng thái thanh toán "chờ thanh toán" hoặc "Pending" khởi tạo giao dịch chưa có IPN
                    order.CreatedDate = DateTime.Now;
                    //Save order to db

                    //Build URL for VNPAY
                    VnPayLibrary vnpay = new VnPayLibrary();

                    //vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
                    vnpay.AddRequestData("vnp_Command", "pay");
                    vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
                    vnpay.AddRequestData("vnp_Amount", (order.Amount * 100).ToString()); //Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 10000000
                    vnpay.AddRequestData("vnp_CreateDate", order.CreatedDate.ToString("yyyyMMddHHmmss"));
                    vnpay.AddRequestData("vnp_CurrCode", "VND");
                    vnpay.AddRequestData("vnp_IpAddr", "::1");

                    vnpay.AddRequestData("vnp_Locale", "vn");
                    vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + order.OrderId);
                    vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other

                    vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
                    vnpay.AddRequestData("vnp_TxnRef", order.OrderId.ToString()); // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày

                    //Add Params of 2.1.0 Version
                    //Billing

                    string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);
                    //Log.InfoFormat("VNPAY URL: {0}", paymentUrl);
                    //Response.Redirect(paymentUrl);
                    //_donHangRepository.CommitTransactionAsync();
                    return paymentUrl;
                }
                catch (Exception ex)
                {
                    //_donHangRepository.RollbackTransactionAsync();
                    return "0";
                }
            }
            private int GiaMoiPhut(M_MatHang item)
            {
                int gia = 1;
                switch (item.LoaiThoiGianApDung)
                {
                    case (int)LOAI_THOI_GIAN_AP_DUNG.PHUT:
                        gia = (int)item.Gia_Ban;
                        break;

                    case (int)LOAI_THOI_GIAN_AP_DUNG.GIO:
                        gia = (int)(item.Gia_Ban / 60);
                        break;

                    case (int)LOAI_THOI_GIAN_AP_DUNG.MGAY:
                        gia = (int)(item.Gia_Ban / 1440);
                        break;
                }
                return gia;
            }
        }
    }
}
