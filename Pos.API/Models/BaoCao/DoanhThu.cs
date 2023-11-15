using Pos.API.Common;

namespace Pos.API.Models.BaoCao
{
    public class DoanhThu
    {
    }

    public class DoanhThuTheoGio
    {
        public int? hh { set; get; }
        public decimal? SoTien { set; get; }
    }
    public class DoanhThuTheoNgay
    {
        public DateTime? ThoiGianThanhToan { set; get; }
        public decimal? Tien_DonHang { set; get; } = 0;
        public decimal? Tien_Giam { set; get; } = 0;
        public decimal? Tien_Thue { set; get; } = 0;
        public decimal? ThanhTien_DonHang { set; get; } = 0;
        public decimal? Tien_Huy { set; get; } = 0;
        public string? Thu
        {
            set { }
            get
            {
                return Utilities.ConvertDayOfWeek(ThoiGianThanhToan.Value.DayOfWeek.ToString());
            }
        }
    }

    public class DoanhThuTongQuanResponse
    {
        public IEnumerable<DoanhThuTheoGio> DtTheoGio { set; get; }
        public IEnumerable<DoanhThuTheoNgay> DtTheoNgay { set; get; }
        public int? SoHDHuy { set; get; } = 0;
        public int? SoLuongMH { set; get; } = 0;
        public int? SoDonHang { set; get; } = 0;
        public int? TBMatHang 
        {
            get
            {
                return SoLuongMH > 0 && SoDonHang > 0 ? SoLuongMH/SoDonHang : 0;
            }
        }
        public int? TBDoanhThu 
        {
            get
            {
                if (SoDonHang > 0 && DtTheoNgay.Count() > 0)
                {
                    var rs = DtTheoNgay.Sum(x => x.ThanhTien_DonHang - x.Tien_Thue);
                    return rs > 0 ? (int)rs / SoDonHang : 0;
                }
                return 0;
            }
        }
    }

    public class HTTTDoanhSo
    {
        public string TenHinhThucThanhToan { set; get; }
        public decimal? ThanhTien_DonHang { set; get; } = 0;
    }

    #region HTTT
    public class HTTTHoaDon
    {
        public string TenHinhThucThanhToan { set; get; }
        public int? SoDonHang { set; get; } = 0;
    }
    public class HTTTDetail
    {
        public string TenHinhThucThanhToan { set; get; }
        public int? SoDonHang { set; get; } = 0;
        public decimal? ThanhTien_DonHang { set; get; } = 0;
    }
    public class DoanhThuHTTTResponse
    {
        public IEnumerable<HTTTDoanhSo> DoanhSo { set; get; }
        public IEnumerable<HTTTHoaDon> HoaDon { set; get; }
        public IEnumerable<HTTTDetail> HTTTDetails { set; get; }
    }
    #endregion

    #region Thu NGan
    public class DTThuNgan
    {
        public string FullName { set; get; }
        public int? SoDonHang { set; get; } = 0;
        public decimal? ThanhTien_DonHang { set; get; } = 0;
        public int? SoLuong_MH { set; get; } = 0;
    }

    public class DoanhThuThuNganResponse
    {
        public IEnumerable<DTThuNgan> DtThuNgan { set; get; }
        public IEnumerable<DTThuNgan> DtThuNganDetails { set; get; }

    }
    #endregion
    #region Phuc Vu
    public class DtPhuVu
    {
        public string FullName { set; get; }
        public int? SoDonHang { set; get; } = 0;
        public decimal? ThanhTien_DonHang { set; get; } = 0;
        public int? SoLuong_MH { set; get; } = 0;
    }
    public class DoanhThuPhucVuResponse
    {
        public IEnumerable<DtPhuVu> DtPhuVu { set; get; }
        public IEnumerable<DtPhuVu> DtPhuVuDetails { set; get; }
    }
    #endregion

    #region Loai DH
    public class DtLoaiDH
    {
        public string LoaiDonHang { set; get; }
        public int? SoDonHang { set; get; } = 0;
        public decimal? ThanhTien_DonHang { set; get; } = 0;
        public int? SoLuong_MH { set; get; } = 0;
    }

    public class DoanhThuLoaiDHResponse
    {
        public IEnumerable<DtLoaiDH> DtLoaiDH { set; get; }
        public IEnumerable<DtLoaiDH> DtLoaiDHDetails { set; get; }

    }
    #endregion

    #region Don Hang Huy
    public class DoanhThuDHHuyResponse
    {
        public string MaDonHang { set; get; }
        public string LyDoHuy { set; get; }
        public decimal? ThanhTien_DonHang { set; get; }
        public string? FullName { set; get; }
        public DateTime? DeleteDate { set; get; }

    }
    #endregion
}
