using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_LichSuTichDiem_KhachHang : EntityBase
    {
        [Key]
        public Guid MaLichSuTichDiem { get; set; }
        public int Ma_KH { get; set; }
        public int SoDonHang { get; set; }
        public int DiemTichLuyCu { get; set; }
        public int DiemTichLuyThem { get; set; }
        public int DiemTichLuyMoi { get; set; }
        public string NoiDungTichLuy { get; set; }
    }
}
