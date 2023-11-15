using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_Nhom_KhachHang :EntityBase
    {
        [Key]
        public int Ma_NKH { get; set; }
        public string Ten_NKH { get; set; }
        public string GhiChu_NKH { get; set; }
    }
}
