using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_DanhMuc_MatHang : EntityBase
    {
        [Key]
        public int Ma_DanhMuc { get; set; }
        public string Ten_DanhMuc { get; set; }
    }
}
