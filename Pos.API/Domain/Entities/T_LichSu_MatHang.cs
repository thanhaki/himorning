using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_LichSu_MatHang: EntityBase
    {
        [Key]
        public int MaLichSu { get; set; }
        public DateTime NgayLichSu { get; set; }
        public int Ma_MH { get; set; }
        public string? Ten_MH { get; set; }
        public string? NoiDung_LichSu { get; set; }
        public int LoaiPhieu_ThamChieu { get; set; }
        public string? Ma_ThamChieu { get; set; }
        public int? SoLuongThayDoi { get; set; }
        public int? SoLuongConLai { get; set; }
    }
}
