using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_NhomQuyen : EntityBase
    {
        [Key]
        public int Ma_NhomQuyen { get; set; }
        public string TenNhomQuyen { get; set; }
        public string GhiChuNhomQuyen { get; set; }
    }
}
