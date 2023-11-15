using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

public class T_DonHangChiTiet: EntityBase
{
    [Key]
    public int SoDonHang { get; set; }
    public int Ma_MH { get; set; }
    public int? Ma_MH_Goc { get; set; }
    public string MaDonHang { get; set; }
    public string? Ten_MH { get; set; }
    public int SoLuong_MH { get; set; }
    public decimal DonGia_MH { get; set; }
    public int PhanTramGiamGia_MH { get; set; }
    public decimal TienGiamGia_MH { get; set; }
    public int PhanTramGiam_DH { get; set; }
    public decimal TienGiamGia_DH { get; set; }
    public string? NoiDungGiamGia_MH { get; set; }
    public decimal ThanhTien_MH { get; set; }
    public DateTime? GioVao { get; set; }
    public DateTime? GioRa { get; set; }
    public int ThoiGianSuDung { get; set; }
    public string? GhiChu { get; set; }
    public int? LoaiChietKhau { get; set; }
}