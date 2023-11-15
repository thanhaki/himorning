namespace Pos.API.Models
{
    public class TheThanhVienModelResponse
    {
        public int? Id { get; set; }
        public int? Ma_TTV { get; set; }
        public string Ten_TTV { get; set; }
        public int DiemToiThieu { get; set; }
        public int DiemToiDa { get; set; }
        public decimal TyLeQuyDoi { get; set; }
        public string MieuTa { get; set; }
        public string GhiChu_TTV { get; set; }
        public int DonVi { get; set; }
        public int? Ma_KH { get; set; }
        public string Ten_KH { get; set; }
        public int? TongSoHoaDon_KH { get; set; }
        public decimal TongThanhToan_KH { get; set; }
        public string? DienThoai_KH { get; set; }
        public bool? IsCheck { get; set; }
        public int? DiemTichLuy { get; set; }
        public int? SoLuongTV { get; set; }

    }
}
