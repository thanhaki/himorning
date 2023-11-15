using Pos.API.Domain.Common;

namespace Pos.API.Models
{
    public class LichSuKhoModelResponse : EntityBase
    {
        public int Id { get; set; }
        public int MaLichSu { get; set; }
        public DateTime NgayLichSu { get; set; }
        public int Ma_MH { get; set; }
        public string? Ten_MH { get; set; }
        public string? NoiDung_LichSu { get; set; }
        public int LoaiPhieu_ThamChieu { get; set; }
        public string? Ma_ThamChieu { get; set; }
        public int? SoLuongThayDoi { get; set; }
        public int? SoLuongConLai { get; set; }
        public string? NguoiTao { get; set; }
    }
}
