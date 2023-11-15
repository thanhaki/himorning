using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_Luong : EntityBase
    {
        [Key]
        public int So_NV { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public double? HeSoCapBac { get; set; }
        public double? HeSoTrachNhiem { get; set; }
        public double? LuongCoBanNgay { get; set; }
        public double? LuongCoBanTangCa { get; set; }
        public double? SoCong { get; set; }
        public double? GioTangCa { get; set; }
        public double? LuongCapBac { get; set; }
        public double? LuongTrachNhiem { get; set; }
        public double? LuongTangCa { get; set; }
        public double? PhuCap { get; set; }
        public double? KhenThuong { get; set; }
        public double? KyLuat { get; set; }
        public double? BaoHiemXaHoi { get; set; }
        public double? LuongThucNhan { get; set; }
        public string? GhiChu { get; set; }
    }
}
