using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_PhieuThuChi : EntityBase
    {
        [Key]
        public int So_PhieuThuChi { get; set; }
        public string? Ma_PhieuThuChi { get; set; }
        public int Loai_PhieuThuChi { get; set; }
        public int MaDanhMucThuChi { get; set; }
        public DateTime NgayLapPhieu { get; set; }
        public DateTime ThoiGianGhiNhan { get; set; }
        public int MaNhomDoiTuong { get; set; }
        public int MaDoiTuong { get; set; }
        public decimal GiaTriThuChi { get; set; }
        public int HoachToanKinhDoanh { get; set; }
        public int SoHinhThucThanhToan { get; set; }
        public string? NoiDung { get; set; }
        public string? FileThuChi { get; set; }
    }
}
