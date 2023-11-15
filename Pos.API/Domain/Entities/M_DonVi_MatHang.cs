using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_DonVi_MatHang : EntityBase
    {
        [Key]
        public int Ma_DonVi { get; set; }
        public string Ten_DonVi { get; set; }
    }
}
