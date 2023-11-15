using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_KhachHang : EntityBase
    {
        [Key]
        public int? Ma_KH { get; set; }
        public int? Ma_NKH { get; set; }
        public int? Loai_KH { get; set; }
        public string Ten_KH { get; set; }
        public string DienThoai_KH { get; set; }
        public string Email_KH { get; set; }
        public DateTime NgaySinh_KH { get; set; }
        public bool GioiTinh_KH { get; set; }
        public string DiaChi_KH { get; set; }
        public string? TinhThanhPho_KH { get; set; }
        public string? QuanHuyen_KH { get; set; }
        public string GhiChu_KH { get; set; }
        public int? TongSoHoaDon_KH { get; set; }
        public decimal TongThanhToan_KH { get; set; }
        public decimal ChiTieuTrungBinh_KH { get; set; }
        public int? DiemTichLuy { get; set; }
        public int? Ma_TTV { get; set; }
        public string? MaHienThi_KH { get; set; }
    }
}
