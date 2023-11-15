using System.Collections.Generic;
using static Pos.API.Constans.CmContext;

namespace Pos.API.Models
{
    public class InforOrderRequest
    {

    }

    public class ChietKhauItem
    {
        public int LoaiCk { set; get; }
        public decimal ValueCk { set; get; }
        public decimal MaxValue { set; get; }
    }

    public class OrderedList
    {
        public List<ItemMatHangDH> MatHangList { set; get; }
        public int? SoDonHang { get; set; } = 0;
        public string? MaDonHang { get; set; }
        public int? TableNo { get; set; } = 0;
        public DateTime? GioVao { get; set; }
        public string? KhuVuc { get; set; }
        public int? LoaiDonHang { get; set; }
        public ChietKhauItem? ChietKhauBill { set; get; }
        public string Timestamp { get; set; }
        public string? GhiChu { get; set; }
        public int MaKhachHang { get; set; }
        public int MaKhuyenMai { get; set; }
    }
    public class ItemMatHangDH
    {
        public int Id { get; set; }
        public int? Ma_MH_Goc { get; set; }
        public string Ten_MH { set; get; }
        public string? Ten_DanhMuc { set; get; }
        public int Ma_DanhMuc { set; get; } = 0;
        public string? GhiChu { set; get; }
        public int SoLuong { set; get; }
        public decimal Gia_Ban { set; get; }
        public decimal Amount { set; get; }
        public int Id_LoaiMH { set; get; }
        public string? NoiDungGiamGia { set; get; }
        public ChietKhauItem? ChietKhau { set; get; }
        public DateTime? GioVao { get; set; }
        public DateTime? GioRa { get; set; }
        public int? SoDonHang { get; set; } = 0;
        public string? MaDonHang { get; set; } = "";
        public int? LoaiChietKhau { get; set; } = 0;
        public int PhanTramGiam_DH { get; set; }
        public decimal TienGiamGia_DH { get; set; }
        public decimal ThanhTien_MH { get; set; }
        public int? ThoiGianApDung { get; set; } = 0;
        public int? LoaiThoiGianApDung { get; set; } = 0;
        public string? QRCode { set; get; }
        public int GiaMoiPhut
        {
            get
            {
                int gia = 1;
                switch (LoaiThoiGianApDung)
                {
                    case (int)LOAI_THOI_GIAN_AP_DUNG.PHUT:
                        gia = (int)Gia_Ban;
                        break;

                    case (int)LOAI_THOI_GIAN_AP_DUNG.GIO:
                        gia = (int)(Gia_Ban / 60);
                        break;

                    case (int)LOAI_THOI_GIAN_AP_DUNG.MGAY:
                        gia = (int)(Gia_Ban / 1440);
                        break;
                }
                return gia;
            }
        }

        public int TotalMinus
        {
            get
            {
                int total = 1;
                if (GioRa != null && GioVao != null)
                {
                    var dateUsed = GioRa - GioVao;
                    total = (int)dateUsed.Value.TotalMinutes;
                }
                return total;
            }
        }
    }

    public class FilterBillRequest
    {
        public string[]? ThuNgan { set; get; }
        public string[]? PhucVu { set; get; }
        public int[]? KhuVuc { set; get; }
        public int[]? PhuongThucThanhToan { set; get; }
        public int[]? KhachHang { set; get; }
        public ThoiGianFilter? thoigian { set; get; }
        public int[]? TinhTrangDH { set; get; }
        public string? MaDonHang { set; get; }
    }

    public class ThoiGianFilter
    {
        public bool IsFilterTheoNgay { set; get; }
        public string? TuNgay { set; get; }
        public string? DenNgay { set; get; }
    }

    public class BillResponse
    {
        public IEnumerable<ItemMatHangDH> ListBillDetails { set; get; }
        public int SoDonHang { get; set; }
        public string MaDonHang { get; set; }
        public string? ThuNgan { get; set; }
        public int TongThoiGian { get; set; }
        public decimal ThanhTien_DonHang { get; set; }
        public DateTime? ThoiGianThanhToan { get; set; }
        public DateTime CreateDate { get; set; }
        public string? HTThanhToan { get; set; }
        public int TinhTrangDH { get; set; }
        public int PhanTram_Giam { get; set; }
        public string? Ten_Outlet { get; set; }
        public string? GhiChu { get; set; }
        public int? Ma_KH { get; set; } = 0;
        public string? Ten_KH { get; set; } = "";
        public int? TongSoLuong { get; set; } = 0;
        public decimal? TongGiamGia { get; set; } = 0;
        public decimal Tien_Giam { get; set; } = 0;
        public int MaKhuyenMai { get; set; } = 0;
        public decimal MaxKhuyenMai { get; set; } = 0;
        public ChietKhauItem ChietKhauBill
        {
            get
            {
                decimal totalTienGiamDH = 0;
                int phanTramCk = 0;
                foreach (var item in ListBillDetails)
                {
                    totalTienGiamDH += item.TienGiamGia_DH;
                }

                if (PhanTram_Giam > 0)
                {
                    phanTramCk = PhanTram_Giam;
                }

                return new ChietKhauItem
                {
                    MaxValue = MaKhuyenMai > 0 ? MaxKhuyenMai : 0,
                    LoaiCk = phanTramCk > 0 ? (int)GIA_TRI_CHIET_KHAU.PHAN_TRAM : (int)GIA_TRI_CHIET_KHAU.SO_TIEN,
                    ValueCk = phanTramCk > 0 ? phanTramCk : totalTienGiamDH
                };
            }
        }
    }
}
