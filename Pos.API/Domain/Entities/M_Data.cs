using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class M_Data : EntityBase
    {
        [Key]
        public int No { get; set; }
        public string? GroupData { get; set; }
        public string? Code { get; set; }
        public string? Type { get; set; }
        public string? Data { get; set; }
        public bool isLock { get; set; }
    }
}
