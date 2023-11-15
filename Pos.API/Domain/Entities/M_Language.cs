using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class M_Language: EntityBase
    {
        [Key]
        public Guid Id { get; set; }
        public int? MaNganhHang { get; set; }
        public string? English { get; set; }
        public string? Vietnamese { get; set; }
        public int MaChucNang { get; set; }
    }
}
