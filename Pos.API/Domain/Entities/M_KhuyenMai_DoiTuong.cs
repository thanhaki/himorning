using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_KhuyenMai_DoiTuong : EntityBase
    {
        [Key]
        public int SoKhuyenMaiDoiTuong { get; set; }
        public int SoKhuyenMai { get; set; }
        public int MaDoiTuong { get; set; }
    }
}
