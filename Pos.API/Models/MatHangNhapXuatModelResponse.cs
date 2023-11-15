namespace Pos.API.Models
{
    public class MatHangNhapXuatModelResponse
    {
        public int Id { get; set; }
        public int Ma_PNX { get; set; }
        public int Ma { get; set; }
        public int Ma_MH { get; set; }
        public string Ten_MH { get; set; }
        public int? Id_LoaiMH { get; set; }
        public int DonVi { get; set; }
        public int SoLuong { get; set; }
        public int? SoLuongBanDau { get; set; }
        public int? SoLuongKiemKe { get; set; }
        public int? SoLuongChenhLech { get; set; }
        public string? LyDoDieuChinh { get; set; }
        public string Ten_DonVi { get; set; }
        public bool? IsCheck { get; set; }

    }
}
