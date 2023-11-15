using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_Ban : EntityBase
    {
        [Key]
        public int Ma_Ban { get; set; }
        public int Ma_Outlet { get; set; }
        public string Ten_Ban { get; set; }
        public decimal X { get; set; }
        public decimal Y { get; set; }
        public decimal Z { get; set; }
        public string? MieuTa_Ban { get; set; }
    }
}
