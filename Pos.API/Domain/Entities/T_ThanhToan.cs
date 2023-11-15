using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_ThanhToan : EntityBase
    {
        [Key]
        public int SoThanhToan { get; set; }
        public string MaDonHang { get; set; }
        public int Sort { get; set; }
        public int MaHinhThucThanhToan { get; set; }
        public string? TenHinhThucThanhToan { get; set; }
        public double SoTien { get; set; }
        public string? Info1 { get; set; }
        public string? Info2 { get; set; }
        public string? Info3 { get; set; }
    }
}
