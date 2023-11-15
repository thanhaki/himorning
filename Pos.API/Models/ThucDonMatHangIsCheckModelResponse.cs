using Pos.API.Domain.Entities;

namespace Pos.API.Models
{
    public class ThucDonMatHangIsCheckModelResponse
    {
        public bool? IsCheck { get; set; }
        public int? Ma_MH { get; set; }
        public int? Ma_DanhMuc { get; set; }
        public string Ten_MH { get; set; }
        public int? DonVi { get; set; }
    }
}
