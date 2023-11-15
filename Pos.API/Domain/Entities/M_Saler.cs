using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pos.API.Domain.Entities
{
    public class M_Saler : EntityBase
    {
        [Key]
        public int Ma_Saler { get; set; }
        public string Ten_Saler { get; set; }
        public string DiaChi_Saler { get; set; }
        public string DienThoai_Saler { get; set; }
        public string Email_Saler { get; set; }
        public int Nhom_Saler { get; set; }
        public int GioiTinh_Saler { get; set; }
        public DateTime NgaySinh_Saler { get; set; }
        public string CCCD_Saler { get; set; }
        public DateTime NgayCap_CCCD_Saler { get; set; }
        public string NoiCapCCCD_Saler { get; set; }
    }
}
