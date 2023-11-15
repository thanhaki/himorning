namespace Pos.API.Models
{
    public class ThucDonModelResponse
    {
        public int? Id { get; set; }
        public string Ten_TD { get; set; }
        public string HinhAnh_TD { get; set; }
        public int? Sort { get; set; }
        public int? DonVi { get; set; }
        public int? SoLuong { get; set; }
        public int? Ma_MH { get; set; } = 0;
        public int? Ma_TD { get; set; } = 0;
        public bool? IsCheck { get; set; }
        public IEnumerable<MatHangModelRespose>? ListMatHang { set; get; }
    }
}
