using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_ThucDon : EntityBase
    {
        [Key]
        public int Ma_TD { get; set; }
        public string Ten_TD { get; set; }
        public string HinhAnh_TD { get; set; }
        public int? Sort { get; set; }
    }
}
