using Pos.API.Domain.Common;

namespace Pos.API.Models
{
    public class NhomKhachHangModelResponse : EntityBase
    {
        public int? Id { get; set; }
        public int? Ma_NKH { get; set; }
        public string? Ten_NKH { get; set; }
        public string? Ten_KH { get; set; }
        public string? GhiChu_NKH { get; set; }
        public int? DonVi { get; set; }
        public int? SoLuong { get; set; }
        public bool? IsCheck { get; set; }
        public int? Ma_KH { get; set; }
        public string? DienThoai_KH { get; set; }
        public int? TongSoHoaDon_KH { get; set; }
        public decimal? TongThanhToan_KH { get; set; }

    }
}
