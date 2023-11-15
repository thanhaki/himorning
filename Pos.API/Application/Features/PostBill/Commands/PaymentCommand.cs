using AutoMapper;
using MediatR;
using Pos.API.Application.Features.DonHang.Commands;
using Pos.API.Application.Persistence;
using Pos.API.Common;
using Pos.API.Constans;
using Pos.API.Domain.Entities;
using Pos.API.Infrastructure.Repositories;
using Pos.API.Models;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq.Expressions;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Application.Features.PostBill.Commands
{
    public class PaymentCommand
    {
        public class PaymentRequest : IRequest<string>
        {
            [Required]
            public List<PaymentOrderedRequest> PaymentInfo { get; set; }

            [Required]
            public string MaDonHang { set; get; }

            [Required]
            public int SoDonHang { set; get; }

            public int? DonVi { set; get; }
            public string? UserName { set; get; }
            public int MaKhachHang { set; get; }
            public string? Timestamp { get; set; }
            public DateTime? GioRa { set; get; }
            public string? GhiChu { get; set; }
        }
        public class Handler : IRequestHandler<PaymentRequest, string>
        {
            private readonly IDonHangRepository _donHangRepository;
            private readonly IThanhToanRepository _thanhToanRepository;
            private readonly IDonHangChiTietRepository _donHangChiTietRepository;
            private readonly ILichSuDonHangRepository _lichSuDonHangRepository;
            private readonly ILichSuTichDiemKHRepository _lichSuTichDiemKHRepository;
            private readonly IKhachHangRepository _khachHangRepository;
            private readonly ITheThanhVienRepository _theThanhVienRepository;
            private readonly IMatHangRepository _matHangRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<PaymentCommand> _logger;

            private bool IsLevelUp = false;
            private string TitleLevelUp = "";
            public Handler(
                IDonHangRepository donHangRepository,
                IMapper mapper, ILogger<PaymentCommand> logger,
                IDonHangChiTietRepository donHangChiTietRepository, 
                ILichSuDonHangRepository lichSuDonHangRepository, 
                IThanhToanRepository thanhToanRepository, 
                ILichSuTichDiemKHRepository lichSuTichDiemKHRepository,
                IKhachHangRepository khachHangRepository,
                ITheThanhVienRepository theThanhVienRepository,
                IMatHangRepository matHangRepository)
            {
                _donHangRepository = donHangRepository ?? throw new ArgumentNullException(nameof(donHangRepository));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _donHangChiTietRepository = donHangChiTietRepository ?? throw new ArgumentNullException(nameof(donHangChiTietRepository));
                _lichSuDonHangRepository = lichSuDonHangRepository ?? throw new ArgumentNullException(nameof(lichSuDonHangRepository));
                _lichSuTichDiemKHRepository = lichSuTichDiemKHRepository ?? throw new ArgumentNullException(nameof(lichSuTichDiemKHRepository));
                _khachHangRepository = khachHangRepository ?? throw new ArgumentNullException(nameof(khachHangRepository));
                _thanhToanRepository = thanhToanRepository ?? throw new ArgumentNullException(nameof(thanhToanRepository));
                _theThanhVienRepository = theThanhVienRepository ?? throw new ArgumentNullException(nameof(theThanhVienRepository));
                _matHangRepository = matHangRepository ?? throw new ArgumentNullException(nameof(matHangRepository));
            }

            public async Task<string> Handle(PaymentRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    _donHangRepository.BeginTransactionAsync();
                    Expression<Func<T_DonHang, bool>> expression = x => x.MaDonHang == request.MaDonHang && x.SoDonHang == request.SoDonHang && x.DonVi == request.DonVi;
                    var donHang = await _donHangRepository.GetFirstOrDefaultAsync(expression);

                    Expression<Func<T_DonHangChiTiet, bool>> getdhct = x => x.MaDonHang == request.MaDonHang && x.SoDonHang == request.SoDonHang && x.DonVi == request.DonVi;
                    var dhct = await _donHangChiTietRepository.GetAsync(getdhct);

                    if (donHang == null) {
                        _donHangRepository.CommitTransactionAsync();
                        return "-1"; 
                    }

                    // Đơn hàng đã thanh toán
                    if (donHang.TinhTrangDonHang == (int)CmContext.TINHTRANGDONHANG.HOAN_THANH_DON_HANG)
                    {
                        _donHangRepository.CommitTransactionAsync();
                        return "-2";
                    }

                    // Kiểm tra đơn hàng có đang update bởi các user khác không
                    if (!string.IsNullOrEmpty(request.Timestamp))
                    {
                        var currentTs = BitConverter.ToUInt64(donHang.Timestamp, 0).ToString();
                        if (currentTs != request.Timestamp)
                        {
                            _donHangRepository.CommitTransactionAsync();
                            return "-2";
                        }
                    }

                    donHang.ThuNgan = request.UserName;
                    donHang.Ma_KhachHang = request.MaKhachHang;
                    donHang.TinhTrangDonHang = (int)CmContext.TINHTRANGDONHANG.HOAN_THANH_DON_HANG;
                    donHang.ThoiGianThanhToan = Utilities.GetDateTimeSystem();
                    
                    var totalDateTime = donHang.ThoiGianThanhToan - donHang.ThoiGianTao;
                    donHang.TongThoiGian = totalDateTime.Value.Minutes;

                    // Add Lich Su Don Hang
                    List<T_LichSu_MatHang> lsDHList = new List<T_LichSu_MatHang>();

                    Func<IQueryable<T_LichSu_MatHang>, IOrderedQueryable<T_LichSu_MatHang>> orderingFunc = x => x.OrderByDescending(X => X.MaLichSu);
                    var maxMaLS = await _lichSuDonHangRepository.GetMaxIdAsync(orderingFunc);
                    int nextMaLS = maxMaLS == null ? 1 : maxMaLS.MaLichSu + 1;
                    
                    decimal soThoiGian = 1;
                    string ghiChu = "";
                    
                    decimal total = 0;
                    decimal TotalTienGiamDH = 0;

                    decimal tienGiamDH = 0;
                    int phanTramGiamDH = 0;

                    int totalMH = dhct.Count;

                    foreach (var item in dhct)
                    {

                        Expression<Func<M_MatHang, bool>> getMH = x => x.Ma_MH == item.Ma_MH && x.Deleted == 0 && x.DonVi == request.DonVi;
                        var matHang = await _matHangRepository.GetFirstOrDefaultAsync(getMH);
                        if (matHang != null) 
                        {
                            T_LichSu_MatHang t_LichSu_MatHang = new T_LichSu_MatHang();
                            t_LichSu_MatHang.MaLichSu = nextMaLS;
                            t_LichSu_MatHang.Ten_MH = item.Ten_MH;
                            t_LichSu_MatHang.Ma_MH = item.Ma_MH;
                            t_LichSu_MatHang.SoLuongThayDoi = item.SoLuong_MH;

                            t_LichSu_MatHang.LoaiPhieu_ThamChieu = 9;
                            t_LichSu_MatHang.NoiDung_LichSu = "Xuất bán";
                            t_LichSu_MatHang.Ma_ThamChieu = donHang.MaDonHang;

                            int soLuongConLai = await _lichSuDonHangRepository.GetSoLuongConLaiMH(item.DonVi, item.Ma_MH);
                            t_LichSu_MatHang.SoLuongConLai = soLuongConLai - item.SoLuong_MH;

                            t_LichSu_MatHang.DonVi = (int)request.DonVi;
                            t_LichSu_MatHang.CreateBy = request.UserName;

                            t_LichSu_MatHang.NgayLichSu = Utilities.GetDateTimeSystem();
                            lsDHList.Add(t_LichSu_MatHang);

                            nextMaLS++;


                            if (matHang != null && matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                if (item.GioRa == null)
                                {
                                    item.GioRa = request.GioRa;
                                }
                            }

                            if (matHang != null && (
                                matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN && item.GioVao != null && item.GioRa != null)
                            )
                            {
                                (soThoiGian, ghiChu) = HandleMatHang.SoThoiGianDaSuDung(matHang, item.GioVao, item.GioRa);
                                item.GhiChu = ghiChu;
                                TimeSpan span = item.GioRa.Value.Subtract(item.GioVao.Value);
                                item.ThoiGianSuDung = span.TotalMinutes > 0 && span.TotalMinutes < 1 ? 1 : (int)span.TotalMinutes;
                            }
                            (string contentGiamgia, decimal tienGiamGiaMH, int phanTramGiamGia) = GetNoiDungGiamGia(item,matHang, soThoiGian);

                            (tienGiamDH, phanTramGiamDH) = TinhToanCkBillMatHang(item, tienGiamGiaMH, totalMH,matHang, soThoiGian);

                            item.NoiDungGiamGia_MH = contentGiamgia;
                            item.TienGiamGia_MH = tienGiamGiaMH;
                            item.PhanTramGiamGia_MH = phanTramGiamGia;

                            item.PhanTramGiam_DH = phanTramGiamDH;
                            item.TienGiamGia_DH = tienGiamDH;

                            item.LoaiChietKhau = item.LoaiChietKhau;
                            decimal price = 0;
                            if (matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                            {
                                price = (item.SoLuong_MH * GiaMoiPhut(matHang) * soThoiGian);
                                total += price;
                                item.ThanhTien_MH = price - item.TienGiamGia_MH - item.TienGiamGia_DH;
                            }
                            else
                            {
                                price = item.SoLuong_MH * item.DonGia_MH;
                                total += price;
                                item.ThanhTien_MH = price - item.TienGiamGia_MH - item.TienGiamGia_DH;
                            }

                            // Tính toán dữ liệu đơn hàng
                            TotalTienGiamDH += item.TienGiamGia_MH + item.TienGiamGia_DH;

                            await _donHangChiTietRepository.UpdateAsync(item);
                        }
                    }
                    if (!string.IsNullOrEmpty(request.GhiChu))
                        donHang.NoiDungGhiChu = donHang.NoiDungGhiChu + request.GhiChu;
                    donHang.Tien_DonHang = total;
                    donHang.Tien_Giam = Math.Round(TotalTienGiamDH);
                    donHang.ThanhTien_DonHang = Math.Round(donHang.Tien_DonHang - donHang.Tien_Giam, 0); 

                    var addListTT = await HandleAddThanhToanAsync(request);
                    (T_LichSuTichDiem_KhachHang lstd, M_KhachHang kh) = await HandleLichSuTichDiem(request, donHang.ThanhTien_DonHang);

                    await _thanhToanRepository.AddRangeAsync(addListTT);
                    await _lichSuDonHangRepository.AddRangeAsync(lsDHList);
                    await _donHangRepository.UpdateAsync(donHang);

                    // Insert ls tích điểm
                    if (lstd != null && lstd.SoDonHang > 0)
                    {
                        await _lichSuTichDiemKHRepository.AddAsync(lstd);
                    }

                    // Update điểm tích lũy Khách hàng
                    if (kh != null)
                    {
                        await _khachHangRepository.UpdateAsync(kh);
                    }

                    _donHangRepository.CommitTransactionAsync();
                    if (IsLevelUp) 
                    {
                        string msg = string.Format(@"Xin chúc mừng khách hàng {0} đã trở thanh khách hàng {2} với số điểm {1} và nhận được nhiều ưu đãi mới.", kh.Ten_KH, kh.DiemTichLuy, TitleLevelUp);
                        return msg;
                    }
                    return "1";
                }
                catch(Exception ex)
                {
                    _donHangRepository.RollbackTransactionAsync();
                    return "0";
                }
            }
            (decimal, int) TinhToanCkBillMatHang(T_DonHangChiTiet item, decimal tienGiamMH, int totalMH, M_MatHang matHang, decimal soThoiGian = 1)
            {
                decimal tienGiamGia = 0;
                int phanTramGiamGia = 0;
                if (item.LoaiChietKhau == (int)LOAI_CHIET_KHAU.CHIET_KHAU_BILL || item.LoaiChietKhau == (int)LOAI_CHIET_KHAU.CHIET_KHAU_BILL_MH)
                {
                    if (item.PhanTramGiam_DH > 0)
                    {
                        if (matHang != null && matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                        {
                            tienGiamGia += (((GiaMoiPhut(matHang) * soThoiGian) - tienGiamMH) * (int)item.PhanTramGiam_DH) / 100;
                        }
                        else
                        {
                            tienGiamGia += (((item.DonGia_MH * item.SoLuong_MH) - tienGiamMH) * (int)item.PhanTramGiam_DH) / 100;

                        }
                        phanTramGiamGia += (int)item.PhanTramGiam_DH;
                    } 
                    else
                    {
                        if (item.TienGiamGia_DH > 0)
                        {
                            tienGiamGia += decimal.Round(item.TienGiamGia_DH, 2, MidpointRounding.AwayFromZero);
                        }
                    }
                }
                return (tienGiamGia, phanTramGiamGia);
            }

            (string, decimal, int) GetNoiDungGiamGia(T_DonHangChiTiet item, M_MatHang matHang, decimal soThoiGian = 1)
            {
                string content = "";
                decimal tienGiamGia = 0;
                int phanTramGiamGia = 0;
                if (item.TienGiamGia_MH > 0 || item.PhanTramGiamGia_MH > 0)
                {
                    if (item.PhanTramGiamGia_MH > 0)
                    {
                        phanTramGiamGia = item.PhanTramGiamGia_MH;
                        if (matHang.Loai_MH == (int)LOAI_MAT_HANG.TINH_TIEN_THEO_THOI_GIAN)
                        {
                            tienGiamGia = (GiaMoiPhut(matHang) * soThoiGian * phanTramGiamGia) / 100;
                        }
                        else
                        {
                            tienGiamGia = (item.DonGia_MH * item.SoLuong_MH * phanTramGiamGia) / 100;
                        }

                        if (tienGiamGia > 0)
                        {
                            content = string.Format(@"Giảm giá {0}% ({1}đ)", phanTramGiamGia, (tienGiamGia).ToString("N0"));
                        }
                    } 
                    else
                    {
                        if (item.TienGiamGia_MH > 0)
                        {
                            tienGiamGia = item.TienGiamGia_MH;
                            content = string.Format(@"Giảm giá {0}đ", item.TienGiamGia_MH.ToString("N0"));
                        }
                    }
                }

                return (content, tienGiamGia, phanTramGiamGia);
            }

            private async Task<List<T_ThanhToan>> HandleAddThanhToanAsync(PaymentRequest request)
            {
                List<T_ThanhToan> addListTT = _mapper.Map<List<T_ThanhToan>>(request.PaymentInfo);

                foreach (var tt in addListTT)
                {
                    tt.CreateBy = request.UserName;
                    tt.MaDonHang = request.MaDonHang;
                    tt.DonVi = (int)request.DonVi;
                }

                return addListTT;
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

            private async Task<(T_LichSuTichDiem_KhachHang, M_KhachHang)> HandleLichSuTichDiem(PaymentRequest request, decimal thanhTien_DH)
            {
                T_LichSuTichDiem_KhachHang lstd = new T_LichSuTichDiem_KhachHang();

                // Get thông tin thẻ thành viên
                Expression<Func<M_KhachHang, bool>> getKH = x => x.Ma_KH == request.MaKhachHang && x.DonVi == request.DonVi && x.Deleted == 0;
                var KH = await _khachHangRepository.GetFirstOrDefaultAsync(getKH);
                if (KH != null)
                {
                    Expression<Func<M_TheThanhVien, bool>> getTTV = x => x.DonVi == request.DonVi && x.Deleted == 0 && x.Ma_TTV == KH.Ma_TTV;
                    var ttvHienTai = await _theThanhVienRepository.GetFirstOrDefaultAsync(getTTV);
                    if (ttvHienTai != null)
                    {
                        lstd.MaLichSuTichDiem = Guid.NewGuid();
                        lstd.SoDonHang = request.SoDonHang;
                        lstd.Ma_KH = KH.Ma_KH.Value;
                        lstd.DonVi = KH.DonVi;

                        var diemTL = thanhTien_DH / ttvHienTai.TyLeQuyDoi;
                        lstd.DiemTichLuyCu = KH.DiemTichLuy.Value;
                        lstd.DiemTichLuyThem = Convert.ToInt32(diemTL);
                        lstd.DiemTichLuyMoi = lstd.DiemTichLuyCu + lstd.DiemTichLuyThem;
                        
                        // Update điểm mới cho khách hàng
                        KH.DiemTichLuy = lstd.DiemTichLuyMoi;

                        lstd.NoiDungTichLuy = string.Format("Hóa đơn số {0}", request.MaDonHang);

                        // Update thẻ thành viên nếu đủ điều kiện
                        Expression<Func<M_TheThanhVien, bool>> getNewTTV = x => x.DonVi == request.DonVi && x.Deleted == 0 && lstd.DiemTichLuyMoi >= x.DiemToiThieu && lstd.DiemTichLuyMoi <= x.DiemToiDa;
                        var ttvNextLevel = await _theThanhVienRepository.GetFirstOrDefaultAsync(getNewTTV);
                        if (ttvNextLevel != null && ttvNextLevel.Ma_TTV > KH.Ma_TTV)
                        {
                            KH.Ma_TTV = ttvNextLevel.Ma_TTV;
                            IsLevelUp = true;
                            TitleLevelUp = ttvNextLevel.Ten_TTV;
                        }
                    }
                }
                return (lstd, KH);
            }
        }
    }
}
