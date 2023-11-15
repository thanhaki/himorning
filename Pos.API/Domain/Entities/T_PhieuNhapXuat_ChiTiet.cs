using Pos.API.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Pos.API.Domain.Entities
{
    public class T_PhieuNhapXuat_ChiTiet : EntityBase
    {
        public int Ma_PNX { get; set; }
        public string Ma_Phieu { get; set; }
        public int Ma_MH { get; set; }
        public int Sort { get; set; }
        public string Ten_MH { get; set; }
        public int SoLuong { get; set; }
        public int? SoLuongBanDau { get; set; }
        public int? SoLuongKiemKe { get; set; }
        public int? SoLuongChenhLech { get; set; }
        public string? LyDoDieuChinh { get; set; }
    }
}
