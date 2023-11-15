using Pos.API.Common;
using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

public class T_DonHang: EntityBase
{
    [Key]
    public int SoDonHang { get; set; }
    public string MaDonHang { get; set; }
    public int Ma_KhachHang { get; set; }
    public int TinhTrangDonHang { get; set; }
    public int LoaiDonHang { get; set; }
    public int Ma_Ban { get; set; }
    public string? PhucVu { get; set; }
    public DateTime Ngay_DonHang { get; set; }
    public DateTime ThoiGianTao { get; set; }
    public DateTime? ThoiGianThanhToan { get; set; }
    public int TongThoiGian { get; set; }
    public string ThuNgan { get; set; }
    public string? NoiDungGhiChu { get; set; }
    public decimal Tien_DonHang { get; set; }
    public int PhanTram_Thue { get; set; }
    public decimal Tien_Thue { get; set; }
    public int PhanTram_Giam { get; set; }
    public decimal Tien_Giam { get; set; }
    public decimal ThanhTien_DonHang { get; set; }
    public int MaKhuyenMai { get; set; }
    public int SoLuongKhach { get; set; }
    public int SoLanIn { set; get; } = 0;
    public int InTamTinh { set; get; } = 0;
    public string? LyDoHuy { set; get; }
}