using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_NhanVien_HeSo : EntityBase
    {
        [Key]
        public int So_NV { get; set; }
        public double CongChuan { get; set; }
        public double LuongCoBan { get; set; }
        public double HeSoLuong { get; set; }
        public double HeSoTrachNhiem { get; set; }
        public double PhuCapThang { get; set; }
        public double TangCaGio { get; set; }
        public double BaoHiemXaHoi { get; set; }
        public double LuongDuKien { get; set; }
        public string GhiChu { get; set; }
    }
}
