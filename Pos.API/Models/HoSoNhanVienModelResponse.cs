namespace Pos.API.Models
{
    public class HoSoNhanVienModelResponse
    {
        public int Id { get; set; }
        public int So_NV { get; set; }
        public string? Ma_NV { get; set; }
        public string? Ten_NV { get; set; }
        public int? Type_NV { get; set; }
        public string? DiaChi_NV { get; set; }
        public string? DienThoai_NV { get; set; }
        public string? Email_NV { get; set; }
        public string? Ten_PhongBan { get; set; }
        public string? TrangThai { get; set; }
        public int? GioiTinh { get; set; }
        public DateTime NgaySinh_NV { get; set; }
        public int? TrinhDo_NV { get; set; }
        public string? CMND_NV { get; set; }
        public string? NoiCapCMND_NV { get; set; }
        public int? PhongBan { get; set; }
        public int? TinhTrang { get; set; }
        public string? GhiChu { get; set; }
    }
}
