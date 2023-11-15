using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class M_Outlet : EntityBase
    {
        [Key]
        public int Ma_Outlet { get; set; }
        public string? Ten_Outlet { get; set; }
        public string? GhiChu { get; set; }
        public int SoLuongBan { get; set; }
    }
}
