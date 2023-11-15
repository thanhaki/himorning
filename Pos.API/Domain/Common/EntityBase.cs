using Pos.API.Common;
using Pos.API.Constans;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Common
{
    public abstract class EntityBase
    {
        public int DonVi { get; set; } = 0;
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = "";
        public DateTime? UpdateDate { get; set; }
        public string? UpdateBy { get; set; } = "";
        public int Deleted { get; set; } = 0;
        public DateTime? DeleteDate { get; set; }
        public string? DeleteBy { get; set; } = "";

        [Timestamp]
        public byte[]? Timestamp { get; set; }
    }
}
