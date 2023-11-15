using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_KhuyenMai_KhoangThoiGian : EntityBase
    {
        [Key]
        public int SoKhuyenMaiKhoangThoiGian { get; set; }
        public int SoKhuyenMai { get; set; }
        public string? ThoiGianBatDau { get; set; }
        public string? ThoiGianKetThuc { get; set; }
    }
}
