using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_NhanVien : EntityBase
    {
        [Key]
        public int So_NV { get; set; }
        public string? Ma_NV { get; set; }
        public int? Type_NV { get; set; }
        public string? Ten_NV { get; set; }
        public string? DiaChi_NV { get; set; }
        public string? DienThoai_NV { get; set; }
        public string? Email_NV { get; set; }
        public string? Ma_HDLD { get; set; }
        public string? FaceBook_NV { get; set; }
        public string? Zalo_NV { get; set; }
        public int GioiTinh { get; set; }
        public DateTime NgaySinh_NV { get; set; }
        public int? TrinhDo_NV { get; set; }
        public string? NgheNghiep_NV { get; set; }
        public string? CMND_NV { get; set; }
        public DateTime NgayCapCMND_NV { get; set; }
        public string? NoiCapCMND_NV { get; set; }
        public int? PhongBan { get; set; }
        public string? FamilyPhone { get; set; }
        public string? SysCode { get; set; }
        public int Foreigner { get; set; }
        public string? Intro { get; set; }
        public int? Star { get; set; }
        public string? Image1 { get; set; }
        public string? Image2 { get; set; }
        public string? Image3 { get; set; }
        public int? TinhTrang { get; set; }
        public string? QuocTich { get; set; }
        public string? ChuyenMon { get; set; }
        public string? ChucDanh { get; set; }
        public string? LoaiHopDong { get; set; }
        public string? MaSoThue { get; set; }
        public string? MaSoBHXH { get; set; }
        public string? MaSoBHYT { get; set; }
        public string? NoiKham { get; set; }
        public string? SoHoKhau { get; set; }
        public string? GhiChu { get; set; }
        public int CoSo { get; set; }

    }
}
