using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_CaLamViec : EntityBase
    {
        [Key]
        public int So_CaLamViec { get; set; }
        public string? Ma_CaLamViec { get; set; }
        public string? MoTa_CaLamViec { get; set; }
        public double? HeSo_CaLamViec { get; set; }
    }
}
