using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_HinhThucThanhToan: EntityBase
    {
        [Key]
        public int SoHinhThucThanhToan { get; set; }
        public int MaHinhThucThanhToan { get; set; }
        public string TenHinhThucThanhToan { get; set; }
        public int TinhTrangHinhThucThanhToan { get; set; }
        public string? HinhAnhHinhThucThanhToan { get; set; }
    }
}
