using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_NhomQuyen_ChucNang : EntityBase
    {
        [Key]
        public int Ma_NhomQuyen { get; set; }
        public string Ma_ChucNang { get; set; }
    }
}
