using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_TheThanhVien : EntityBase
    {
        [Key]
        public int Ma_TTV { get; set; }
        public string Ten_TTV { get; set; }
        public int DiemToiThieu { get; set; }
        public int DiemToiDa { get; set; }
        public decimal TyLeQuyDoi { get; set; }
        public string MieuTa { get; set; }
        public string GhiChu_TTV { get; set; }
    }
}
