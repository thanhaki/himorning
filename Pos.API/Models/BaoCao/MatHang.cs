using Pos.API.Common;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Pos.API.Models.BaoCao
{
    public class MatHang
    {
    }

    public class DanhMucMatHangTheoDoanhSo
    {
        public string? Ten_DanhMuc { set; get; }
        public decimal? ThanhTien_DonHang { set; get; }

    }

    public class DanhMucMatHangTheoHoaDon
    {
        public string? Ten_DanhMuc { set; get; }
        public int? SoDonHang { set; get; }
    }

    public class DanhMucMatHangDetail
    {
        public string? Ten_DanhMuc { set; get; }
        public string? Ten_MH { set; get; }
        public int? SoLuongMatHang { set; get; }
        public decimal? DonGia_MH { set; get; }
        public decimal? ThanhTien_MH { set; get; }
        public decimal? TienGiamGia { set; get; }
        public int? Ma_DanhMuc { set; get; }
    }

    public class DanhMucMatHangResponse
    {
        public IEnumerable<DanhMucMatHangTheoDoanhSo> DoanhSos { get; set; }
        public IEnumerable<DanhMucMatHangTheoHoaDon> HoaDons { get; set; }
        public IEnumerable<DanhMucMatHangDetail> Details { get; set; }
    }


    public class MatHangBanChayDetail
    {
        public string? Ten_MH { set; get; }
        public string? Ten_DanhMuc { set; get; }
        public int? SoLuongMatHang { set; get; }
        public decimal? ThanhTien_MH { set; get; }

    }

    public class MatHangBanChayHoaDon
    {
        public string? Ten_MH { set; get; }
        public int? SoDonHang { set; get; }
    }

    public class MatHangBanChayResponse
    {
        public IEnumerable<MatHangBanChayHoaDon> HoaDons { get; set; }
        public IEnumerable<MatHangBanChayDetail> DoanhSos { get; set; }
        public IEnumerable<MatHangBanChayDetail> Details { get; set; }
    }

    public class MatHangData
    {
        public string? Ten_DanhMuc { set; get; }
        public string? Ten_MH { set; get; }
        public int? Ma_MH { set; get; }
        public string? MaDonHang { set; get; }
        public string? GhiChu { set; get; }
        public int? SoLuong_MH { set; get; }
        public int? STT { set; get; }
        public int? Ma_DanhMuc { set; get; }
        public int? TotalMh { set; get; }
        public IEnumerable<ItemMh> ItemMhs { set; get; }
    }

    public class ItemMh
    {
        public string? Ten_MH { set; get; }
        public int? Ma_MH { set; get; }
        public string? MaDonHang { set; get; }
        public string? GhiChu { set; get; }
        public int? SoLuong_MH { set; get; }
    }
    public class MatHangDaHuyResponse
    {
        public string? Ten_DanhMuc { set; get; }
        public int? Ma_DanhMuc { set; get; }
        public int? TotalDM { set; get; }
        public List<MatHangData> MatHangDatas { get; set; }
    }

    public class DoanhThuBanHang
    {
        public decimal TienHang { set; get; }
        public decimal TienThue { set; get; }
    }

    public class DanhMucThuChi
    {
        public string Ten_DanhMucThuChi { set; get; }
        public decimal GiaTriThuChi { set; get; }
    }

    public class DoanhThuGiamTru
    {
        public decimal GiamGia { set; get; }
        public decimal HuyHoan { set; get; }

    }
    public class TaiChinhTongHop
    {
        public IEnumerable<DanhMucThuChi> ThuNhap { set; get; }
        public decimal TongThuNhap
        {
            set { }
            get
            {
                return ThuNhap.Sum(x => x.GiaTriThuChi);
            }
        }
        public IEnumerable<DanhMucThuChi> ChiPhi { set; get; }
        public decimal TongChiPhi
        {
            set { }
            get
            {
                return ChiPhi.Sum(x => x.GiaTriThuChi);
            }
        }
        public DoanhThuBanHang DoanhThuBanHang { set; get; }
        public DoanhThuGiamTru DoanhThuGiamTru { set; get; }
        public decimal TongDoanhThuBanHang
        {
            set { }
            get
            {
                return Math.Round(DoanhThuBanHang.TienHang - DoanhThuBanHang.TienThue);
            }
        }
        public decimal TongDoanhThuGiamTru
        {
            set { }
            get
            {
                return Math.Round(DoanhThuGiamTru.GiamGia + DoanhThuGiamTru.HuyHoan);
            }
        }

        public decimal DoanhThuThuan
        {
            set { }
            get
            {
                return Math.Round(TongDoanhThuBanHang - TongDoanhThuGiamTru);
            }
        }
        
        public decimal GiaVonHangBan
        {
            set { }
            get
            {
                return 0;
            }
        }
        public decimal DoanhThuGop
        {
            set { }
            get 
            {
                return DoanhThuThuan - GiaVonHangBan;
            }
        }

        public decimal LoiNhuanTruocThue 
        {
            set { }
            get
            {
                return DoanhThuGop - TongChiPhi + TongThuNhap;
            }
        }
    }

    public class KetQuaKDResponse
    {
        public TaiChinhTongHop KyHienTai { set; get; }
        public TaiChinhTongHop KySoSanh { set; get; }
        public IEnumerable<DanhMucThuChiTongHop> ThuNhap { set; get; }
        public IEnumerable<DanhMucThuChiTongHop> ChiPhi { set; get; }
    }
    public class DanhMucThuChiTongHop
    {
        public string Ten_DanhMucThuChi { set; get; }
        public decimal? GiaTriKyHienTai { set; get; } = 0;
        public decimal? GiaTriKySoSanh { set; get; } = 0;
    }

    public class LoiNhuanTheoMHResponse
    {

    }
}
