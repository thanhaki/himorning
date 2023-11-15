using Pos.API.Domain.Common;

namespace Pos.API.Models
{
    public class LichSuTichDiemKhModelResponse : EntityBase
    {
        public Guid Id { get; set; }
        public Guid MaLichSuTichDiem { get; set; }
        public int Ma_KH { get; set; }
        public int SoDonHang { get; set; }
        public int DiemTichLuyCu { get; set; }
        public int DiemTichLuyThem { get; set; }
        public int DiemTichLuyMoi { get; set; }
        public string NoiDungTichLuy { get; set; }
        public string MaDonHang { get; set; }
        public decimal Tien_DonHang { get; set; }
    }
}
