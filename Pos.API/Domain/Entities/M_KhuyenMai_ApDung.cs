using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_KhuyenMai_ApDung : EntityBase
    {
        [Key]
        public int SoKhuyenMaiApDung { get; set; }
        public int SoKhuyenMai { get; set; }
        public int MaApDung { get; set; }
    }
}
