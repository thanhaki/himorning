using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class M_DanhMuc_ThuChi : EntityBase
    {
        [Key]
        public int MaDanhMucThuChi { get; set; }
        public int Loai_DanhMucThuChi { get; set; }
        public string? Ten_DanhMucThuChi { get; set; }
        public string? GhiChu_DanhMucThuChi { get; set; }
    }
}
